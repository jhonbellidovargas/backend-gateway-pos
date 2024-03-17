import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ExpirationDateValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const expirationYear = request.body.expiration_year;
    const expirationYearInt = parseInt(expirationYear);
    const currentYear = new Date().getFullYear();
    if (
      expirationYearInt < currentYear ||
      expirationYearInt > currentYear + 5
    ) {
      throw new BadRequestException(
        'The expiration year is not valid. Please use a valid expiration year',
      );
    }
    return next.handle();
  }
}
