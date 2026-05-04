import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) return;

  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables.');
  }

  try {
    await mongoose.connect(uri);
    console.log('✅  MongoDB connected successfully.');
  } catch (error) {
    console.error('❌  MongoDB connection failed:', error);
    // Do not use process.exit(1) in serverless, let the caller handle it
    throw error;
  }
};

// Mongoose connection event listeners
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️   MongoDB disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error('❌  MongoDB error:', err);
});

export default connectDB;
