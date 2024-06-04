import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are found
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );
  const cors = {
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PATCH,PUT,POST,DELETE,OPTIONS',
  };
  app.enableCors(cors);
  await app.listen(3000);
}
bootstrap();
