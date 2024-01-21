import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { applyGlobalConfig } from './global-config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const config = new DocumentBuilder()
    .setTitle('Nest.js Clean Arch')
    .setDescription(
      'Node.js REST API with Nest.js, TypeScript, DDD, Clean Architecture and Automated tests.',
    )
    .setVersion('1.0.0')
    .addBearerAuth({
      description: 'Inform jwt to authorize access',
      name: 'Authorization',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  applyGlobalConfig(app);
  await app.listen(3333, '0.0.0.0');
}
bootstrap();
