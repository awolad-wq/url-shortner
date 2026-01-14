import crypto from "crypto";

export const guestTracker = (req, res, next) => {
  let guestId = req.cookies.guest_id;

  if (!guestId) {
    guestId = crypto.randomUUID();

    res.cookie("guest_id", guestId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: "/",
    });
  }

  req.guestId = guestId;
  next();
};
