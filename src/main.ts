import { NestFactory } from '@nestjs/core';

// ========================== modules ====================================
import { AppModule } from './app.module';

// ========================== swagger ====================================
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const start = async () => {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 5000;

  const swagger = new DocumentBuilder()
    .setTitle('Ivashin test task')
    .setDescription('Node.js test task')
    .setVersion('0.0.1')
    .addTag('Test task')
    .build();

  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('swagger', app, document);
  app.listen(port, () => console.log(`Server started from ${port}`));
};
start();
