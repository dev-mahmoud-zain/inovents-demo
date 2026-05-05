import 'reflect-metadata';
import 'dotenv/config';
import createApp from './app';
import connectDB from './config/database';

const PORT = Number(process.env.PORT) || 3000;

const bootstrap = async (): Promise<void> => {
  // Connect to MongoDB first
  await connectDB();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`🚀  inovents server running on http://localhost:${PORT}`);
    console.log(`📋  Environment: ${process.env.NODE_ENV ?? 'development'}`);
  });
};

bootstrap().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
