import { Injectable, PipeTransform, UnauthorizedException } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@songkeys/nestjs-redis';
import { Users } from '../domains/Users';

@Injectable()
export class AuthPipe implements PipeTransform {
  constructor(
    @InjectRedis() private readonly cache: Redis, // @InjectCluster() private readonly cache: Cluster,
  ) {}

  public async transform(token: string) {
    if (!token) {
      throw new UnauthorizedException('Not Found Token.');
    }
    const tokenInfo = await this.cache.get(`${Users.keyAt}${token}`);
    if (!tokenInfo) {
      throw new UnauthorizedException('Not Found Token Info.');
    }

    return JSON.parse(tokenInfo) as Users;
  }
}
