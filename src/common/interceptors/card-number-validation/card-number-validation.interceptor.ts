import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CardNumberValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const cardNumber = request.body.card_number;
    const cardNumberString = cardNumber.toString();
    const cardNumberArray = cardNumberString.split('');
    const cardNumberArrayReversed = cardNumberArray.reverse();
    let sum = 0;
    for (let i = 0; i < cardNumberArrayReversed.length; i++) {
      let cardNumberDigit = parseInt(cardNumberArrayReversed[i]);
      if (i % 2 !== 0) {
        cardNumberDigit *= 2;
        if (cardNumberDigit > 9) {
          cardNumberDigit -= 9;
        }
      }
      sum += cardNumberDigit;
    }
    if (sum % 10 !== 0) {
      throw new BadRequestException(
        'The card number is not valid. Please use a valid card number',
      );
    }
    return next.handle();
  }
}
