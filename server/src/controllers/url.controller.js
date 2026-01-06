import prisma from "../config/database.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { nanoid } from "nanoid";

export const createShortUrl = asyncHandler(async (req, res) => {  // ✅ Fixed name
  const { originalUrl } = req.body;

  const shortCode = nanoid(6);
//   console.log(shortCode);

  const newUrl = await prisma.url.create({
    data: {
      shortCode,
      originalUrl,
    },
  });

  res.status(201).json({
    shortUrl: `${req.protocol}://${req.get("host")}/api/v1/${newUrl.shortCode}`,
    data: newUrl,
  });
});

export const getUrl = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const url = await prisma.url.findUnique({
    where: {
      shortCode: code,
    },
  });

  if (!url) {
    return res.status(404).json({ error: "URL not found" });
  }

  await prisma.url.update({
    where: {
      shortCode: code,
    },
    data: {
      clicks: { increment: 1 },
    },
  });

  return res.redirect(url.originalUrl);
});