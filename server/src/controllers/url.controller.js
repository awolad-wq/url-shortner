import prisma from '../config/database.js'  // Use the configured one
import { asyncHandler } from '../utils/asyncHandler.js'
import { nanoid } from 'nanoid'

export const createSortUrl = asyncHandler(async(req, res) => {
   const {originalUrl} = req.body;

   const shortIdToken = nanoid(6)
   console.log(shortIdToken);

   res.status(200).json({
    success:"true",
    result:`${req.protocol}://${req.get("host")}/${shortIdToken}`
   })
})