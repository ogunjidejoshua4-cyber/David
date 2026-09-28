// Line 1: Import Node.js DNS promises module
import dns from 'node:dns/promises';

// Line 2: Force Node runtime to use Cloudflare and Google DNS servers to resolve Atlas domains
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Line 3: Load environment variables from .env
import dotenv from 'dotenv';
dotenv.config();

// Line 4: Import Express and CORS middleware
import express from 'express';
import cors from 'cors';

// Line 5: Import database connector function
import connectDB from './config/db.js';

// Line 6: Import project and profile route modules
import projectRoutes from './routes/projectRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

// Line 7: Initialize Express app instance
const app = express();

// Line 8: Enable JSON request parsing
app.use(express.json());

// Line 9: Enable CORS for frontend requests
app.use(cors());

// Line 10: Establish connection to MongoDB Atlas
connectDB();

// Line 11: Mount routes for project portfolio and profile management
app.use('/api/projects', projectRoutes);
app.use('/api/profile', profileRoutes);

// Line 12: Basic health-check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Line 13: Define port and start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Portfolio backend running on http://localhost:${PORT}`);
});