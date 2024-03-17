import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokensModule } from './tokens/tokens.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfig } from './config/env.config';
import { ConfigModule } from '@nestjs/config';
import { EmailValidationInterceptor } from './common/interceptors/email-validation/email-validation.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CardNumberValidationInterceptor } from './common/interceptors/card-number-validation/card-number-validation.interceptor';
import { ExpirationDateValidationInterceptor } from './common/interceptors/expiration-date-validation/expiration-date-validation.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
          },
        }),
      }),
    }),
    MongooseModule.forRoot(
      process.env.MONGODB || 'mongodb://localhost:27017/nest-tokens',
    ),
    TokensModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: EmailValidationInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CardNumberValidationInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ExpirationDateValidationInterceptor,
    },
  ],
})
export class AppModule {}
