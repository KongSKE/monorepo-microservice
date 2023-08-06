import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'libs/database/database.module';
import { CoreModule } from 'libs/core/core.module';

@Module({
  imports: [
    CoreModule.register(),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
