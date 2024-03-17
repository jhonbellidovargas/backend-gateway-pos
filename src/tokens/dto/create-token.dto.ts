import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(13)
  @MaxLength(16)
  card_number: string;

  @IsString()
  @MinLength(3)
  @MaxLength(4)
  cvv: string;

  @IsString()
  @MinLength(1)
  @MaxLength(2)
  expiration_month: string;

  @IsString()
  @MinLength(4)
  @MaxLength(4)
  expiration_year: string;
}
