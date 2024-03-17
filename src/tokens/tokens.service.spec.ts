import { Test, TestingModule } from '@nestjs/testing';
import { TokensService } from './tokens.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Token } from './entities/token.entity';
import { JwtService } from '@nestjs/jwt';

describe('TokensService', () => {
  let service: TokensService;

  const mockTokenModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };
  const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokensService,
        { provide: getModelToken(Token.name), useValue: mockTokenModel },
        { provide: JwtService, useValue: mockJwtService },
        { provide: 'CACHE_MANAGER', useValue: mockCache },
      ],
    }).compile();

    service = module.get<TokensService>(TokensService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a token', async () => {
      const createTokenDto: CreateTokenDto = {
        email: 'mail@gmail.com',
        card_number: '4012888888881881',
        cvv: '123',
        expiration_month: '1',
        expiration_year: '2024',
      };

      mockTokenModel.create.mockReturnValueOnce(createTokenDto);

      const result = await service.create(createTokenDto);

      expect(mockTokenModel.create).toHaveBeenCalledWith(createTokenDto);
      expect(result).toEqual(createTokenDto);
    });

    it('should handle exceptions when creating a token', async () => {
      const createTokenDto: CreateTokenDto = {
        email: 'mail@gmail.com',
        card_number: '4012888888881881',
        cvv: '123',
        expiration_month: '1',
        expiration_year: '2024',
      };

      mockTokenModel.create.mockRejectedValueOnce(new Error());

      await expect(service.create(createTokenDto)).rejects.toThrow();
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const token = 'valid_token';

      mockJwtService.verify.mockReturnValueOnce({ card_number: '1234' });

      const result = await service.verifyToken(token);

      expect(mockJwtService.verify).toHaveBeenCalledWith(token);
      expect(result.card_number).toEqual('1234');
    });

    it('should handle exceptions when verifying an invalid token', async () => {
      const token = 'invalid_token';

      mockJwtService.verify.mockRejectedValueOnce(new Error('Invalid token'));

      await expect(service.verifyToken(token)).rejects.toThrowError(
        'Invalid token',
      );
    });
  });
});
