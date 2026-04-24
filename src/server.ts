import { buildApp } from './app';
import { env } from './config/env';

const start = async (): Promise<void> => {
  const app = buildApp();

  try {
    await app.listen({
      host: '0.0.0.0',
      port: env.PORT,
    });
  } catch (error) {
    app.log.error(error, 'failed to start server');
    process.exit(1);
  }
};

void start();
