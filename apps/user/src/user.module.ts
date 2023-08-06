import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'libs/database/database.module';
import { CoreModule } from 'libs/core/core.module';

@Module({
  imports: [
    CoreModule.register(),
    DatabaseModule,
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
