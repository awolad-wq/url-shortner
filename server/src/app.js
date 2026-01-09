import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import urlRouter from './routes/short.routes.js';
import { xss } from "express-xss-sanitizer";

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Trust proxy (for X-Forwarded-For header)
app.set('trust proxy', true);

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'URL Shortener API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use(xss());

// URL shortener routes
app.use('/api/v1', urlRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

export default app;