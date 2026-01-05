import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import prisma, { pool } from './config/database.js';
import userRoute from "./routes/user.routes.js"

const app = express();

// Request logger - add this FIRST
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Middleware - More permissive CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  console.log('Root route hit!');
  res.json({ message: 'Server is running!' });
});


app.get('/health', async (req, res) => {
  console.log('Health route hit!');
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message 
    });
  }
});





app.use("/api/v1", userRoute)






// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  await pool.end();
  console.log('Database disconnected');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  await pool.end();
  console.log('Database disconnected');
  process.exit(0);
});

export default app;