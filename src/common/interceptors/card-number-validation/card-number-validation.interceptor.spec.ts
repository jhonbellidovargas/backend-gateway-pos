import { CardNumberValidationInterceptor } from './card-number-validation.interceptor';

describe('CardNumberValidationInterceptor', () => {
  it('should be defined', () => {
    expect(new CardNumberValidationInterceptor()).toBeDefined();
  });
});
