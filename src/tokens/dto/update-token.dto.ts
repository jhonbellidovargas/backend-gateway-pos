import { PartialType } from '@nestjs/mapped-types';
import { CreateTokenDto } from './create-token.dto';
import { IsDate, IsString } from 'class-validator';
export class UpdateTokenDto extends PartialType(CreateTokenDto) {
  @IsString()
  token?: string;

  @IsDate()
  token_expiration?: Date;
}
