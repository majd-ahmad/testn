import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllConfigType } from './app/config/config.type';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AllConfigType>);
  const logger = app.get(Logger);
  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          key: error.constraints[Object.keys(error.constraints)[0]],
        }));
        throw new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors();

  await app.listen(configService.getOrThrow('app.port', { infer: true }));

  logger.log(`Application is running on: ${await app.getUrl()}`);
  if (process.env.NODE_ENV === 'development') {
    const pathToSwaggerStaticFolder = resolve(process.cwd(), 'swagger-static');

    // write swagger json file
    const pathToSwaggerJson = resolve(
      pathToSwaggerStaticFolder,
      'swagger.json',
    );
    const swaggerJson = JSON.stringify(document, null, 2);
    writeFileSync(pathToSwaggerJson, swaggerJson);
    console.log(`Swagger JSON file written to: '/swagger-static/swagger.json'`);
  }
}

bootstrap();
