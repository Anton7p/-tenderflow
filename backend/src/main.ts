import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    exposedHeaders: ['Content-Disposition'],
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend started on http://0.0.0.0:${port}/api`);
}

void bootstrap();
