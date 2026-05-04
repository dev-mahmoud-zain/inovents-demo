import 'dotenv/config';
import createApp from './src/app';
import connectDB from './src/config/database';

const app = createApp();

// Vercel serverless entry point
export default async (req: any, res: any) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Vercel entry error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during initialization.' });
  }
};
