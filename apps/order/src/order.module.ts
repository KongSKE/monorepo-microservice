import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'libs/database/database.module';
import appConfig from 'libs/config/app.config';
import { CoreModule } from 'libs/core/core.module';

@Module({
  imports: [
    CoreModule.register(),
    DatabaseModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
