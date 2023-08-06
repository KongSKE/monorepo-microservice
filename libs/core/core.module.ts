import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientService } from 'libs/client/service.ts/client.service';
import appConfig from 'libs/config/app.config';


@Module({})
export class CoreModule {
  static register(): DynamicModule {
    return {
      module: CoreModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig],
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('jwt.secretKey'),
          }),
          inject: [ConfigService],
          global: true,
        }),
      ],
      exports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig],
        }),
        ClientService,
      ],
      providers: [ClientService],
    };
  }
}