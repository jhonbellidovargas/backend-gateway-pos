import {
  Controller,
  Post,
  Body,
  Headers,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TokensService } from './tokens.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { EmailValidationInterceptor } from '../common/interceptors/email-validation/email-validation.interceptor';
import { CardNumberValidationInterceptor } from '../common/interceptors/card-number-validation/card-number-validation.interceptor';
import { ExpirationDateValidationInterceptor } from '../common/interceptors/expiration-date-validation/expiration-date-validation.interceptor';
@ApiTags('Tokens')
@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post()
  @UseInterceptors(EmailValidationInterceptor)
  @UseInterceptors(CardNumberValidationInterceptor)
  @UseInterceptors(ExpirationDateValidationInterceptor)
  create(@Body() createTokenDto: CreateTokenDto) {
    return this.tokensService.createToken(createTokenDto);
  }

  @Post('verify')
  verifyToken(@Headers('authorization') authHeader: string) {
    const token = authHeader.replace('Bearer ', '');
    return this.tokensService.verifyToken(token);
  }
}
