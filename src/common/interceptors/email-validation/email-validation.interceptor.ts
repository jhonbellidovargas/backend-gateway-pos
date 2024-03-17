import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class EmailValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const email = request.body.email;
    const allowedDomains = ['gmail.com', 'hotmail.com', 'yahoo.com'];
    const domain = email.split('@')[1];

    if (!allowedDomains.includes(domain)) {
      throw new BadRequestException(
        'The email is not allowed. Please use a gmail.com, hotmail.com or yahoo.com email',
      );
    }

    return next.handle();
  }
}
