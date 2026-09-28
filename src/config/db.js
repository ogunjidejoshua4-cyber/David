// Line 1: Import mongoose to construct and manage the MongoDB connection
import mongoose from 'mongoose';

// Line 2: Import dns promises module from Node.js standard library
import dns from 'node:dns/promises';

// Line 3: Force Node.js to use Cloudflare and Google public DNS servers for Atlas SRV lookups
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Line 4: Declare an asynchronous function named connectDB to handle database connections
const connectDB = async () => {
  // Line 5: Wrap the connection call in a try block to intercept connection failures gracefully
  try {
    // Line 6: Connect to MongoDB Atlas using the URI string stored in your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Line 7: Print a success message confirming the cluster host address once connected
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  // Line 8: Catch block executes if MongoDB Atlas rejects the connection
  } catch (error) {
    // Line 9: Print the exact connection error message to your terminal for quick debugging
    console.error(`❌ DB Connection Error: ${error.message}`);

    // Line 10: Terminate the Node.js process with exit code 1 to prompt nodemon for restart
    process.exit(1);
  // Line 11: Close the try-catch block
  }
// Line 12: Close the connectDB function declaration
};

// Line 13: Export the connectDB function as default so server.js can run it on startup
export default connectDB;