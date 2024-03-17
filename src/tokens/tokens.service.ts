import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { CreateTokenDto } from './dto/create-token.dto';
import { Token } from './entities/token.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateTokenDto } from './dto/update-token.dto';

@Injectable()
export class TokensService {
  constructor(
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private jwtService: JwtService,
  ) {}

  async create(createTokenDto: CreateTokenDto) {
    try {
      const token = await this.tokenModel.create(createTokenDto);
      return token;
    } catch (error) {
      this.handleExeptions(error);
    }
  }

  async createToken(createTokenDto: CreateTokenDto) {
    let card: Token = await this.tokenModel.findOne({
      card_number: createTokenDto.card_number,
    });
    if (!card) {
      card = await this.create(createTokenDto);
    }
    if (!card) {
      throw new InternalServerErrorException(
        'An error occurred while creating the card. Please try again.',
      );
    }
    const token = this.jwtService.sign(
      { card_number: card.card_number.toString() },
      {
        expiresIn: '1m',
      },
    );
    const updateData: UpdateTokenDto = {
      token,
      token_expiration: new Date(Date.now() + 60000),
    };
    return await this.update(card._id, updateData);
  }

  async verifyToken(token: string) {
    try {
      const decoded = await this.jwtService.verify(token);
      const card: Token = await this.tokenModel.findOne({
        card_number: decoded.card_number,
      });
      if (!card) {
        throw new BadRequestException('Card not found');
      }
      card.cvv = undefined;
      return card;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException('Invalid token');
      }
      throw new BadRequestException('Invalid token');
    }
  }

  async findAll() {
    const key = 'tokens-find-all';
    const tokensCached = await this.cacheManager.get(key);
    if (tokensCached) {
      return tokensCached;
    }
    const tokens = await this.tokenModel.find();
    await this.cacheManager.set(key, tokens, 100 * 10);
    return tokens;
  }

  async update(id: number, updateTokenDto: UpdateTokenDto) {
    try {
      const token = await this.tokenModel.findByIdAndUpdate(
        id,
        { $set: updateTokenDto },
        { new: true },
      );
      return token;
    } catch (error) {
      this.handleExeptions(error);
    }
  }

  private handleExeptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Card with value ${Object.values(error.keyValue)} already exists`,
      );
    }
    throw new InternalServerErrorException(
      'An error occurred while creating the card. Please try again.',
    );
  }
}
