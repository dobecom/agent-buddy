import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { ConfigType } from '@nestjs/config';
import { authConfig } from '../configs';
import { Request } from 'express';
import { Redis } from 'ioredis';
import { InjectRedis } from '@songkeys/nestjs-redis';
import { Users } from '../domains/Users';
import { ErrorCodes } from '../code/error/error.code';
import { Logger } from '../utils/logger';

@Injectable()
export class ResignStrategy extends PassportStrategy(Strategy, 'jwt-resign') {
  constructor(
    @Inject(authConfig.KEY)
    private authConf: ConfigType<typeof authConfig>,
    @InjectRedis() private readonly cache: Redis,
    // @InjectCluster() private readonly cache: Cluster,
    private logger: Logger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConf.resign.secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any): Promise<Users> {
    this.logger.log(`2. validate Pass\n>> uid : ${payload.uid}`, 'ResignGuard');
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException({
        code: ErrorCodes.UA004
      });
    }

    const [type, token] = authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException({
        code: ErrorCodes.UA005
      });
    }

    const tokenInfo = await this.cache.get(`${Users.keyRt}${token}`);
    if (!tokenInfo) {
      throw new UnauthorizedException({
        code: ErrorCodes.UA006
      });
    }

    const users = new Users();
    users.id = payload.id;

    return users;
  }
}
