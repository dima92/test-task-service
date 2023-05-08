import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import 'dotenv/config';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const swagger = new DocumentBuilder()
    .setTitle('Service test task from Ivashin')
    .setDescription('NestJS test task')
    .setVersion('0.0.1')
    .addTag('Test task from Ivashin')
    .build();

  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
bootstrap();
