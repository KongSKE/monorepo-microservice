import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DatabaseModule } from 'libs/database/database.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from 'libs/config/app.config';
import { CoreModule } from 'libs/core/core.module';

@Module({
  imports: [
    CoreModule.register(),
    DatabaseModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
