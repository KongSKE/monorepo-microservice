import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { Order, OrderSchema } from './schemas/order.schema';

const DB_FEATURE: ModelDefinition[] = [
  {
    name: User.name,
    schema: UserSchema,
  },
  {
    name: Order.name,
    schema: OrderSchema,
  },
  {
    name: Product.name,
    schema: ProductSchema,
  },
]

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('mongodb.host');
        const database = configService.get<string>('mongodb.database');
        const port = configService.get<string>('mongodb.port');
        return { uri: `mongodb://${host}:${port}/${database}` };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(DB_FEATURE),
  ],
  exports: [MongooseModule.forFeature(DB_FEATURE)],
})
export class DatabaseModule {}