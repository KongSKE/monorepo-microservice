import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Order service')
    .setDescription('The Order service description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get<string>('service.order.port'));
}
bootstrap();
