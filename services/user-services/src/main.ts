import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Middleware } from './middleware/auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new Middleware().use);
  await app.listen(3000);
}
bootstrap();

