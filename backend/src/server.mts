import app from './bundle.generated.mjs';

const PORT = process.env.PORT || 3001;

// Start server locally when not running inside serverless / production
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 MessApp Backend API running on port ${PORT}`);
  });
}

export default app;
