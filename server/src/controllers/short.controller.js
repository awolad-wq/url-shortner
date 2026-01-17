import crypto from "crypto";
import prisma from "../config/database.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { nanoid } from "nanoid";
import { verifyUrl } from "../services/urlVerifier.js";

const DEFAULT_EXPIRATION_DAYS = 30;

const hashIp = (ip) => {
  if (!ip) {
    return null;
  }
  return crypto.createHash("sha256").update(ip).digest("hex");
};

const getExpirationDate = (days = DEFAULT_EXPIRATION_DAYS) => {
  const now = new Date();
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
};

const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const allowedProtocols = ["http:", "https:"];

    if (!allowedProtocols.includes(urlObj.protocol)) {
      return { valid: false, error: "Only HTTP and HTTPS URLs are allowed" };
    }
    const hostname = urlObj.hostname.toLowerCase();
    const blockedHosts = ["localhost", "127.0.0.1", "0.0.0.0", "::1"];

    if (
      process.env.NODE_ENV === "production" &&
      blockedHosts.includes(hostname)
    ) {
      return { valid: false, error: "Internal URLs are not allowed" };
    }
    return { valid: true };
  } catch (error) {
    return { valid: false, error: "Invalid URL Format" };
  }
};

const isValidAlias = (alias) => {
  if (!alias) return { valid: false, error: "Alias is required" };

  const aliasRegex = /^[a-zA-Z0-9_-]{3,20}$/;

  if (!aliasRegex.test(alias)) {
    return {
      valid: false,
      error:
        "Alias must be 3-20 characters (alphanumeric, hyphens, underscores only)",
    };
  }

  const reservedAliases = [
    "shorten",
    "stats",
    "api",
    "admin",
    "health",
    "user",
    "auth",
    "check",
  ];
  if (reservedAliases.includes(alias.toLowerCase())) {
    return { valid: false, error: "This alias is reserved" };
  }

  return { valid: true };
};

const generateUniqueAlias = async (length = 6, maxRetries = 5) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const alias = nanoid(length);

    // Collision detection: Check database
    const existing = await prisma.link.findUnique({
      where: { alias },
    });

    if (!existing) {
      return { success: true, alias };
    }

    // Collision detected - increase length after 2 failures
    if (attempt > 2) {
      length += 1;
    }
  }
  return { success: false, error: "Failed to generate unique alias" };
};

const rateLimitStore = new Map();

const checkRateLimit = (identifier) => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 10;

  if (!rateLimitStore.has(identifier)) {
    rateLimitStore.set(identifier, []);
  }

  const requests = rateLimitStore.get(identifier);
  const recentRequests = requests.filter((time) => now - time < windowMs);

  if (recentRequests.length >= maxRequests) {
    return {
      allowed: false,
      retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000),
    };
  }

  recentRequests.push(now);
  rateLimitStore.set(identifier, recentRequests);

  return { allowed: true };
};

// Cleanup old rate limit entries every hour
setInterval(() => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;

  for (const [key, requests] of rateLimitStore.entries()) {
    const recentRequests = requests.filter((time) => now - time < windowMs);
    if (recentRequests.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, recentRequests);
    }
  }
}, 60 * 60 * 1000);

const cleanupExpiredLinks = async () => {
  try {
    const now = new Date();

    const result = await prisma.link.deleteMany({
      where: {
        expiresAt: { lte: now },
      },
    });

    if (result.count > 0) {
      console.log(`[Cleanup] Deleted ${result.count} expired links`);
    }
  } catch (error) {
    console.error("[Cleanup] Error:", error);
  }
};

setInterval(cleanupExpiredLinks, 60 * 60 * 1000);
cleanupExpiredLinks();

export const createShortUrl = asyncHandler(async (req, res) => {
  const { originalUrl, customAlias, expirationDays } = req.body;
  const userId = req.user?.id; // From optional auth middleware
  const guestId = req.guestId; // 🔥 Get guestId from middleware

  // RATE LIMITING
  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.ip || "unknown";

  const rateLimitCheck = checkRateLimit(clientIp);

  if (!rateLimitCheck.allowed) {
    return res.status(429).json({
      success: false,
      error: "Too many requests. Please try again later",
      retryAfter: rateLimitCheck.retryAfter,
    });
  }

  // INPUT VALIDATION
  if (!originalUrl) {
    return res.status(400).json({
      success: false,
      error: "Original URL is required",
    });
  }

  const urlValidation = isValidUrl(originalUrl);
  if (!urlValidation.valid) {
    return res.status(400).json({
      success: false,
      error: urlValidation.error,
    });
  }

  const verify = await verifyUrl(originalUrl);
  if (!verify.isAccessible) {
    return res.status(400).json({
      success: false,
      error: "URL is not reachable or DNS does not exist",
    });
  }

  // CUSTOM ALIAS VALIDATION
  let alias;
  if (customAlias) {
    const aliasValidation = isValidAlias(customAlias);
    if (!aliasValidation.valid) {
      return res.status(400).json({
        success: false,
        error: aliasValidation.error,
      });
    }

    const existingAlias = await prisma.link.findUnique({
      where: { alias: customAlias },
    });

    if (existingAlias) {
      return res.status(409).json({
        success: false,
        error: "Custom alias already exists. Please choose another one",
      });
    }

    alias = customAlias;
  }

  // AUTO-SET EXPIRATION DATE
  const expDays = expirationDays || DEFAULT_EXPIRATION_DAYS;
  const expirationDate = getExpirationDate(expDays);

  let existingLink;

  // Check for existing link (user-specific OR guest-specific)
  if (!customAlias) {
    const whereCondition = {
      longUrl: originalUrl,
      isActive: true,
      expiresAt: { gt: new Date() },
    };

    // 🔥 FIX: Check based on userId OR guestId
    if (userId) {
      // Authenticated user: check only their links
      whereCondition.userId = userId;
    } else if (guestId) {
      // Guest user: check only their guest links
      whereCondition.guestId = guestId;
      whereCondition.userId = null;
    } else {
      // No user or guest: skip duplicate check
      whereCondition.userId = null;
      whereCondition.guestId = null;
    }

    existingLink = await prisma.link.findFirst({
      where: whereCondition,
    });
  }

  if (existingLink) {
    return res.status(200).json({
      success: true,
      message: "URL already shortened",
      shortUrl: `${req.protocol}://${req.get("host")}/${
        existingLink.alias
      }`,
      data: {
        alias: existingLink.alias,
        originalUrl: existingLink.longUrl,
        createdAt: existingLink.createdAt,
        expiresAt: existingLink.expiresAt,
        isOwned: !!userId,
      },
    });
  }

  // GENERATE UNIQUE ALIAS WITH RETRY LOGIC
  if (!alias) {
    const generation = await generateUniqueAlias(6, 5);

    if (!generation.success) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate unique alias. Please try again",
      });
    }

    alias = generation.alias;
  }

  // CREATE SHORT URL
  try {
    // 🔥 FIX: Save userId OR guestId based on authentication
    const newLink = await prisma.link.create({
      data: {
        alias,
        longUrl: originalUrl,
        expiresAt: expirationDate,
        userId: userId || null, // null if not authenticated
        guestId: userId ? null : guestId, // only set if not authenticated
      },
    });

    res.status(201).json({
      success: true,
      message: "Short URL created successfully",
      shortUrl: `${req.protocol}://${req.get("host")}/${newLink.alias}`,
      data: {
        alias: newLink.alias,
        originalUrl: newLink.longUrl,
        createdAt: newLink.createdAt,
        expiresAt: newLink.expiresAt,
        isOwned: !!userId,
        isGuest: !userId && !!guestId,
      },
    });
  } catch (error) {
    console.error("Error creating short URL:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: "Alias already exists. Please try again",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to create short URL. Please try again",
    });
  }
});

export const getUrl = asyncHandler(async (req, res) => {
  const { alias } = req.params;

  const link = await prisma.link.findUnique({
    where: { alias },
  });

  // Missing alias returns 404
  if (!link) {
    return res.status(404).json({
      success: false,
      error: "Short URL not found",
    });
  }

  // Disabled links handled safely
  if (!link.isActive) {
    return res.status(403).json({
      success: false,
      error: "This short URL has been disabled",
    });
  }

  // Expired links handled correctly
  if (link.expiresAt && new Date() > link.expiresAt) {
    return res.status(410).json({
      success: false,
      error: "This short URL has expired",
    });
  }

  // TRACK CLICK ANALYTICS
  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.ip;

  const ipHash = hashIp(clientIp); // Hash only, never raw IP
  const referrer = req.get("referrer") || req.get("referrer") || null;
  const userAgent = req.get("user-agent") || null;

  // Record click (fire and forget - don't block redirect)
  // 🔥 FIX: Use 'referrer' to match Prisma schema (not 'referrer')
  prisma.click
    .create({
      data: {
        linkId: link.id,
        ipHash,
        referrer: referrer, // Match schema field name
        userAgent,
      },
    })
    .catch((error) => console.error("Failed to record click:", error));

  // Redirect with 302 (temporary) to ensure clicks are tracked
  return res.redirect(302, link.longUrl);
});

export const getUrlStats = asyncHandler(async (req, res) => {
  const { alias } = req.params;

  const link = await prisma.link.findUnique({
    where: { alias },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  if (!link) {
    return res.status(404).json({
      success: false,
      error: "Short URL not found",
    });
  }

  // Check authorization for private link stats
  const isOwner = req.user && link.userId === req.user.id;
  const isAdmin = req.user && req.user.role === "ADMIN";
  // 🔥 FIX: Also check if guest owns this link
  const isGuestOwner = !req.user && req.guestId && link.guestId === req.guestId;

  // If link is owned by a user and requester is not owner/admin, limit stats
  if (link.userId && !isOwner && !isAdmin) {
    return res.status(200).json({
      success: true,
      data: {
        alias: link.alias,
        originalUrl: link.longUrl,
        createdAt: link.createdAt,
        isPrivate: true,
        message: "Detailed statistics are only available to the link owner",
      },
    });
  }

  // If link is owned by a guest and requester is not that guest, limit stats
  if (link.guestId && !isGuestOwner && !isAdmin) {
    return res.status(200).json({
      success: true,
      data: {
        alias: link.alias,
        originalUrl: link.longUrl,
        createdAt: link.createdAt,
        isPrivate: true,
        message: "Detailed statistics are only available to the link owner",
      },
    });
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Query 1: Total clicks per link
  const totalClicks = await prisma.click.count({
    where: { linkId: link.id },
  });

  // Query 2: Clicks in last 7 days
  const clicksLast7Days = await prisma.click.count({
    where: {
      linkId: link.id,
      createdAt: { gte: sevenDaysAgo },
    },
  });

  // Query 3: Clicks in last 30 days
  const clicksLast30Days = await prisma.click.count({
    where: {
      linkId: link.id,
      createdAt: { gte: thirtyDaysAgo },
    },
  });

  // Query 4: Clicks per day (last 30 days)
  const clicksRaw = await prisma.click.findMany({
    where: {
      linkId: link.id,
      createdAt: { gte: thirtyDaysAgo },
    },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const clicksByDay = {};
  clicksRaw.forEach((click) => {
    const date = click.createdAt.toISOString().split("T")[0];
    clicksByDay[date] = (clicksByDay[date] || 0) + 1;
  });

  // Query 5: Top referrers
  // 🔥 FIX: Use 'referrer' to match Prisma schema
  const referrersRaw = await prisma.click.groupBy({
    by: ["referrer"],
    where: {
      linkId: link.id,
      referrer: { not: null },
    },
    _count: { referrer: true },
    orderBy: { _count: { referrer: "desc" } },
    take: 5,
  });

  const topReferrers = referrersRaw.map((r) => ({
    referrer: r.referrer,
    count: r._count.referrer,
  }));

  const isExpired = link.expiresAt ? new Date() > link.expiresAt : false;

  // Clean JSON response
  res.status(200).json({
    success: true,
    data: {
      alias: link.alias,
      originalUrl: link.longUrl,
      createdAt: link.createdAt,
      expiresAt: link.expiresAt,
      isExpired,
      isActive: link.isActive,
      isBroken: link.isBroken,
      lastChecked: link.lastChecked,
      owner: link.user
        ? {
            name: link.user.name,
            email: isOwner || isAdmin ? link.user.email : undefined,
          }
        : link.guestId
        ? { type: "guest" }
        : null,
      analytics: {
        totalClicks,
        clicksLast7Days,
        clicksLast30Days,
        clicksByDay,
        topReferrers,
      },
    },
  });
});

// NEW: Get all links for authenticated user
export const getUserLinks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, filter = "all" } = req.query;
  const skip = (page - 1) * limit;

  const whereCondition = { userId: req.user.id };

  // Apply filters
  if (filter === "active") {
    whereCondition.isActive = true;
    whereCondition.expiresAt = { gt: new Date() };
  } else if (filter === "expired") {
    whereCondition.expiresAt = { lte: new Date() };
  } else if (filter === "broken") {
    whereCondition.isBroken = true;
  }

  const [links, total] = await Promise.all([
    prisma.link.findMany({
      where: whereCondition,
      include: {
        _count: {
          select: { clicks: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(limit),
    }),
    prisma.link.count({
      where: whereCondition,
    }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      links: links.map((link) => ({
        alias: link.alias,
        originalUrl: link.longUrl,
        shortUrl: `${req.protocol}://${req.get("host")}/${link.alias}`,
        clicks: link._count.clicks,
        createdAt: link.createdAt,
        expiresAt: link.expiresAt,
        isActive: link.isActive,
        isBroken: link.isBroken,
        lastChecked: link.lastChecked,
        isExpired: link.expiresAt ? new Date() > link.expiresAt : false,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// NEW: Get user dashboard statistics
export const getUserStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [
    totalLinks,
    activeLinks,
    expiredLinks,
    brokenLinks,
    totalClicks,
    recentClicks,
  ] = await Promise.all([
    // Total links
    prisma.link.count({
      where: { userId },
    }),
    // Active links
    prisma.link.count({
      where: {
        userId,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
    }),
    // Expired links
    prisma.link.count({
      where: {
        userId,
        expiresAt: { lte: new Date() },
      },
    }),
    // Broken links
    prisma.link.count({
      where: {
        userId,
        isBroken: true,
      },
    }),
    // Total clicks across all user links
    prisma.click.count({
      where: {
        link: { userId },
      },
    }),
    // Recent clicks (last 7 days)
    prisma.click.count({
      where: {
        link: { userId },
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  // Get top 5 performing links
  const topLinks = await prisma.link.findMany({
    where: { userId },
    include: {
      _count: {
        select: { clicks: true },
      },
    },
    orderBy: {
      clicks: {
        _count: "desc",
      },
    },
    take: 5,
  });

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalLinks,
        activeLinks,
        expiredLinks,
        brokenLinks,
        totalClicks,
        recentClicks,
      },
      topLinks: topLinks.map((link) => ({
        alias: link.alias,
        originalUrl: link.longUrl,
        clicks: link._count.clicks,
        createdAt: link.createdAt,
      })),
    },
  });
});

// NEW: Update link (toggle active, change expiration)
export const updateLink = asyncHandler(async (req, res) => {
  const { alias } = req.params;
  const { isActive, expirationDays } = req.body;

  const link = await prisma.link.findUnique({
    where: { alias },
  });

  if (!link) {
    return res.status(404).json({
      success: false,
      error: "Short URL not found",
    });
  }

  // Check authorization
  const isOwner = link.userId === req.user.id;
  const isAdmin = req.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      error: "You don't have permission to update this link",
    });
  }

  const updateData = {};

  if (typeof isActive === "boolean") {
    updateData.isActive = isActive;
  }

  if (expirationDays) {
    updateData.expiresAt = getExpirationDate(expirationDays);
  }

  const updatedLink = await prisma.link.update({
    where: { alias },
    data: updateData,
  });

  res.status(200).json({
    success: true,
    message: "Link updated successfully",
    data: {
      alias: updatedLink.alias,
      originalUrl: updatedLink.longUrl,
      isActive: updatedLink.isActive,
      expiresAt: updatedLink.expiresAt,
    },
  });
});

// NEW: Delete link
export const deleteLink = asyncHandler(async (req, res) => {
  const { alias } = req.params;

  const link = await prisma.link.findUnique({
    where: { alias },
  });

  if (!link) {
    return res.status(404).json({
      success: false,
      error: "Short URL not found",
    });
  }

  // Check authorization
  const isOwner = link.userId === req.user.id;
  const isAdmin = req.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      error: "You don't have permission to delete this link",
    });
  }

  await prisma.link.delete({
    where: { alias },
  });

  res.status(200).json({
    success: true,
    message: "Link deleted successfully",
  });
});

// NEW: Check URL health (verify if URL is still accessible)
export const checkUrlHealth = asyncHandler(async (req, res) => {
  const { alias } = req.params;

  const link = await prisma.link.findUnique({
    where: { alias },
  });

  if (!link) {
    return res.status(404).json({
      success: false,
      error: "Short URL not found",
    });
  }

  // Check authorization for owned links
  if (link.userId) {
    const isOwner = req.user && link.userId === req.user.id;
    const isAdmin = req.user && req.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "You don't have permission to check this link",
      });
    }
  }

  // Verify URL
  const result = await verifyUrl(link.longUrl);

  // Update link status
  await prisma.link.update({
    where: { id: link.id },
    data: {
      isBroken: !result.isAccessible,
      lastChecked: new Date(),
    },
  });

  res.status(200).json({
    success: true,
    data: {
      alias: link.alias,
      originalUrl: link.longUrl,
      isAccessible: result.isAccessible,
      statusCode: result.statusCode,
      lastChecked: new Date(),
      message: result.isAccessible
        ? "URL is accessible"
        : "URL is not accessible or broken",
    },
  });
});

// ADMIN: Get all links with pagination
export const getAllLinks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, filter = "all" } = req.query;
  const skip = (page - 1) * limit;

  const whereCondition = {};

  if (filter === "broken") {
    whereCondition.isBroken = true;
  } else if (filter === "expired") {
    whereCondition.expiresAt = { lte: new Date() };
  }

  const [links, total] = await Promise.all([
    prisma.link.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        _count: {
          select: { clicks: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(limit),
    }),
    prisma.link.count({
      where: whereCondition,
    }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      links: links.map((link) => ({
        alias: link.alias,
        originalUrl: link.longUrl,
        clicks: link._count.clicks,
        createdAt: link.createdAt,
        expiresAt: link.expiresAt,
        isActive: link.isActive,
        isBroken: link.isBroken,
        lastChecked: link.lastChecked,
        owner: link.user
          ? {
              id: link.user.id,
              email: link.user.email,
              name: link.user.name,
            }
          : link.guestId
          ? { type: "guest", id: link.guestId }
          : null,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});