import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "../config/database.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateToken = () => crypto.randomBytes(32).toString("hex");

const getSessionExpiry = () =>
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

/* ===================== REGISTER ===================== */
export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required",
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: "Email already registered",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationToken = generateToken();

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      verificationToken,
    },
  });

  // 🔥 CLAIM GUEST LINKS
  if (req.guestId) {
    await prisma.link.updateMany({
      where: {
        guestId: req.guestId,
        userId: null,
      },
      data: {
        userId: user.id,
        guestId: null,
      },
    });
  }

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: {
      userId: user.id,
      email: user.email,
    },
  });
});

/* ===================== LOGIN ===================== */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required",
    });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      success: false,
      error: "Invalid credentials",
    });
  }

  const token = generateToken();

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt: getSessionExpiry(),
    },
  });

  res.cookie("session_token", session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:  "lax",
    expires: getSessionExpiry(),
  });

  // 🔥 CLAIM GUEST LINKS
  if (req.guestId) {
    await prisma.link.updateMany({
      where: {
        guestId: req.guestId,
        userId: null,
      },
      data: {
        userId: user.id,
        guestId: null,
      },
    });

    res.clearCookie("guest_id", { path: "/" });
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
    },
  });
});

/* ===================== LOGOUT ===================== */
export const logout = asyncHandler(async (req, res) => {
  await prisma.session.delete({
    where: { id: req.session.id },
  });

  res.clearCookie("session_token");

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

/* ===================== PROFILE ===================== */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});
