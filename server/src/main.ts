import { NestFactory } from '@nestjs/core';
import { Express } from 'express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CoordinatesHandler } from './geoHandling/coordinates';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'tool2rent-pictures'), {
    prefix: '/tool2rent-pictures',
  });
  const config = new DocumentBuilder()
  .setTitle('My API')
  .setDescription('The description of the API')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors()
  await app.listen(3000);
}
bootstrap();
