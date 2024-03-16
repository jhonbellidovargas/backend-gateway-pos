import { Inject, Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { Token } from './entities/token.entity';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class TokensService {
  constructor(@Inject('CACHE_MANAGER') private cacheManager: Cache) {}
  create(createTokenDto: CreateTokenDto) {
    return 'This action adds a new token';
  }

  async findAll() {
    const key = 'tokens-find-all';
    const tokensCached = await this.cacheManager.get(key);

    if (tokensCached) {
      console.log('cached', tokensCached);
      return tokensCached;
    }

    const tokens: Token[] = [
      {
        id: '1',
        cardNumber: '1234567890123456',
        expirationDate: new Date(),
        createdAt: new Date(),
      },
      {
        id: '2',
        cardNumber: '1234567890123456',
        expirationDate: new Date(),
        createdAt: new Date(),
      },
    ];
    await this.cacheManager.set(key, tokens, 100 * 10);
    return tokens;
  }

  findOne(id: number) {
    return `This action returns a #${id} token`;
  }

  update(id: number, updateTokenDto: UpdateTokenDto) {
    return `This action updates a #${id} token`;
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
  }
}
