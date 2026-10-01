// Line 1: Import mongoose for database interactions
import mongoose from 'mongoose';

// Line 2: Import dns promises to resolve SRV records
import dns from 'node:dns/promises';

// Line 3: Use Google and Cloudflare DNS to bypass ISP lookup issues
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Line 4: Declare async database connector
const connectDB = async () => {
  // Line 5: Safe execution block
  try {
    // Line 6: Connect using MONGO_URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // Line 7: Confirm successful connection
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  // Line 8: Catch connection errors
  } catch (error) {
    // Line 9: Log the error to Render console without crashing the server
    console.error(`❌ DB Connection Error: ${error.message}`);
    // Notice: We removed process.exit(1) so Render keeps the server alive
  }
};

// Line 10: Export connection function
export default connectDB;