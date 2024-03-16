export class CreateTokenDto {
  readonly id: string;
  readonly cardNumber: string;
  readonly expirationDate: Date;
  readonly createdAt: Date;
}
