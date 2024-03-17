import { TokensService } from './tokens.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

describe('TokensService', () => {
  let service: TokensService;

  const mockTokenModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const cacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    service = new TokensService(
      cacheManager as any,
      mockTokenModel as any,
      mockJwtService as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new token', async () => {
      const createTokenDto = {
        email: 'mail@gmail.com',
        card_number: '4012888888881881',
        cvv: '123',
        expiration_month: '1',
        expiration_year: '2024',
      };
      const expectedToken = {};
      mockTokenModel.create.mockResolvedValue(expectedToken);

      const result = await service.create(createTokenDto);

      expect(mockTokenModel.create).toHaveBeenCalledWith(createTokenDto);
      expect(result).toEqual(expectedToken);
    });

    it('should throw InternalServerErrorException if creation fails', async () => {
      const createTokenDto = {
        email: 'mail@gmail.com',
        card_number: '4012888888881881',
        cvv: '123',
        expiration_month: '1',
        expiration_year: '2024',
      };
      mockTokenModel.create.mockRejectedValue(new Error('Mock error'));

      await expect(service.create(createTokenDto)).rejects.toThrow();
    });
  });
});
