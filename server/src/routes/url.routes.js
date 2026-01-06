import express from 'express'
import { createShortUrl, getUrl } from '../controllers/url.controller.js'
const router = express.Router()

router.post("/create", createShortUrl)  // ✅ createShortUrl
router.get("/:code", getUrl)

export default router