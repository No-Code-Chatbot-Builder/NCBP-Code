import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export const setEnvironmentVariables = () => {
  try {
    const secret = process.env.SECRET;
    if (!secret) {
      throw new Error('SECRET environment variable is not provided.');
    }

    const secretJson = JSON.parse(secret);
    const requiredKeys = [
      'DYNAMODB_TABLE_NAME',
      'PINECONE_API_KEY',
      'S3_BUCKET_NAME',
      'PINECONE_INDEX_NAME',
      'USER_POOL_ID',
      'CLIENT_ID',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'AWS_DEFAULT_REGION',
      'OPENAI_API_KEY' ,
    ];

    requiredKeys.forEach((key) => {
      if (!secretJson[key]) {
        throw new Error(`Required key not found in secret: ${key}`);
      }
      process.env[key] = secretJson[key];
    });
  } catch (error) {
    console.error(error);
    process.exit(1); // Exit the application if secrets can't be loaded.
  }
};

async function bootstrap() {
 setEnvironmentVariables();
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:3000' });
  await app.listen(80);
}
bootstrap();
