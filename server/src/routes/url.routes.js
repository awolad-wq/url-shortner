import express from 'express'
import { createSortUrl } from '../controllers/url.controller.js'
const router = express.Router()

router.post("/create", createSortUrl)

export default router