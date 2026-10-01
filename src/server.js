// Line 1: Import DNS promises module to configure custom nameservers
import dns from 'node:dns/promises';

// Line 2: Route DNS queries through Cloudflare and Google to prevent Atlas SRV resolution failures
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Line 3: Load environment variables from the local .env file
import dotenv from 'dotenv';
dotenv.config();

// Line 4: Import Express web framework and CORS security middleware
import express from 'express';
import cors from 'cors';

// Line 5: Import database connection function
import connectDB from './config/db.js';

// Line 6: Import project and profile route handlers
import projectRoutes from './routes/projectRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

// Line 7: Initialize the Express application instance
const app = express();

// Line 8: Define allowed frontend URLs (live Vercel portfolio domain and local Vite dev server)
const allowedOrigins = [
  'https://david-akano.vercel.app',
  'http://localhost:5173'
];

// Line 9: Configure CORS middleware to check request origin against the allowed list
app.use(cors({
  // Line 10: Origin validator function evaluating incoming client requests
  origin: function (origin, callback) {
    // Line 11: Allow requests with no origin (like mobile tools or curl) or matching our allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      // Line 12: Grant permission to process the request
      callback(null, true);
    } else {
      // Line 13: Reject unauthorized origins trying to access your API
      callback(new Error('Blocked by CORS policy: Unauthorized origin'));
    }
  },
  // Line 14: Allow HTTP cookies and authorization headers across origins
  credentials: true,
}));

// Line 15: Enable parsing of incoming JSON payload bodies
app.use(express.json());

// Line 16: Connect to MongoDB Atlas database
connectDB();

// Line 17: Base landing route to confirm the API service is active and eliminate "Cannot GET /"
app.get('/', (req, res) => {
  res.status(200).send('🚀 David Portfolio API is live and connected to MongoDB!');
});

// Line 18: Health check route for uptime monitors and server status inspection
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Line 19: Mount routes for portfolio projects CRUD
app.use('/api/projects', projectRoutes);

// Line 20: Mount routes for owner profile data and avatar uploads
app.use('/api/profile', profileRoutes);

// Line 21: Assign port from environment variables or fallback to port 5000
const PORT = process.env.PORT || 5000;

// Line 22: Start Express HTTP server and listen on assigned port
app.listen(PORT, () => {
  console.log(`🚀 Portfolio backend running on port ${PORT}`);
});