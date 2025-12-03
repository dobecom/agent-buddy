import { Injectable, PipeTransform, UnauthorizedException } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@songkeys/nestjs-redis';

@Injectable()
export class TokenPipe implements PipeTransform {
  constructor(
    @InjectRedis() private readonly cache: Redis, // @InjectCluster() private readonly cache: Cluster,
  ) {}

  public async transform(token: string) {
    if (!token) {
      throw new UnauthorizedException('Not Found Token.');
    }

    return token;
  }
}
