import {
  Controller,
  Post,
  Body,
  Headers,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TokensService } from './tokens.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { EmailValidationInterceptor } from 'src/common/interceptors/email-validation/email-validation.interceptor';
import { CardNumberValidationInterceptor } from 'src/common/interceptors/card-number-validation/card-number-validation.interceptor';
import { ExpirationDateValidationInterceptor } from 'src/common/interceptors/expiration-date-validation/expiration-date-validation.interceptor';

@ApiTags('Tokens')
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post()
  @UseInterceptors(new EmailValidationInterceptor())
  @UseInterceptors(new CardNumberValidationInterceptor())
  @UseInterceptors(new ExpirationDateValidationInterceptor())
  create(@Body() createTokenDto: CreateTokenDto) {
    return this.tokensService.createToken(createTokenDto);
  }

  @Post('verify')
  verifyToken(@Headers('authorization') authHeader: string) {
    const token = authHeader.replace('Bearer ', '');
    return this.tokensService.verifyToken(token);
  }
}
