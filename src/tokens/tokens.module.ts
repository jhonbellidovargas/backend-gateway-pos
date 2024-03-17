import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { Token, TokenSchema } from './entities/token.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: 'process.env.JWT_SECRET',
      signOptions: { expiresIn: '1m' },
    }),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  controllers: [TokensController],
  providers: [TokensService],
  exports: [TokensService, MongooseModule],
})
export class TokensModule {}
