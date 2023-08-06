import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Product service')
    .setDescription('The Product service description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get<string>('service.product.port'));
}
bootstrap();
