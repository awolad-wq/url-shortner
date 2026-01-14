import axios from "axios";
import prisma from "../config/database.js";

export const verifyUrl = async (url) => {
  try {
    const response = await axios.head(url, {
      timeout: 5000,
      maxRedirects: 5,
      validateStatus: (status) => status < 500,
    });

    return {
      isAccessible: response.status < 400,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      isAccessible: false,
      statusCode: error.response?.status || 0,
      error: error.message,
    };
  }
};

export const checkBrokenLinks = async () => {
  const links = await prisma.link.findMany({
    where: {
      isActive: true,
      OR: [
        { lastChecked: null },
        { lastChecked: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      ],
    },
    take: 100,
  });

  for (const link of links) {
    const result = await verifyUrl(link.longUrl);

    await prisma.link.update({
      where: { id: link.id },
      data: {
        isBroken: !result.isAccessible,
        lastChecked: new Date(),
      },
    });
  }
};

// Run every 6 hours
setInterval(checkBrokenLinks, 6 * 60 * 60 * 1000);