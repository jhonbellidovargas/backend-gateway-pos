import { Test, TestingModule } from '@nestjs/testing';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER, CacheModule } from '@nestjs/common';

describe('TokensController', () => {
  let controller: TokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokensController],
      providers: [
        TokensService,
        {
          provide: getModelToken('Token'),
          useValue: {},
        },
        JwtService,
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
      ],
      imports: [CacheModule.register({})],
    }).compile();

    controller = module.get<TokensController>(TokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
