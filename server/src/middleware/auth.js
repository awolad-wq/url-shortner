import prisma from "../config/database.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.session_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || new Date() > session.expiresAt) {
      return res.status(401).json({
        success: false,
        error: "Session expired",
      });
    }

    req.user = session.user;
    req.session = session;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid session",
    });
  }
};



export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.session_token;

    if (token) {
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });

      if (session && new Date() <= session.expiresAt) {
        req.user = session.user;
        req.session = session;
      }
    }
  } catch (error) {
    // silently ignore
  }
  next();
};


export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Insufficient permissions",
      });
    }

    next();
  };
};