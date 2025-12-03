import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { authConfig } from '../configs';
import type { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { Redis } from 'ioredis';
import { InjectRedis } from '@songkeys/nestjs-redis';
import { Users } from '../domains/Users';
import { ErrorCodes } from '../code/error/error.code';
import { Logger } from '../utils/logger';

@Injectable()
export class SignStrategy extends PassportStrategy(Strategy, 'jwt-sign') {
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
      secretOrKey: authConf.sign.secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any): Promise<Users> {
    this.logger.log(`2. validate Pass\n>> uid : ${payload.uid}`, 'SignGuard');
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException({
        code: ErrorCodes.UA004,
      });
    }

    const [type, token] = authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException({
        code: ErrorCodes.UA005,
      });
    }

    const tokenInfo = await this.cache.get(`${Users.keyAt}${token}`);
    if (!tokenInfo) {
      // Error
      const expireInfo = await this.cache.get(`${Users.keyExpire}${token}`);
      if (!expireInfo) {
        // - Require SignIn Again
        throw new ForbiddenException({
          code: ErrorCodes.FB004,
        });
      } else {
        // - Require Resign
        throw new UnauthorizedException({
          code: ErrorCodes.UA006,
        });
      }
    } else {
      // For Test
      if (payload.exp !== 9999999999) {
        // Reset Expire Time
        await this.cache.expire(`${Users.keyExpire}${token}`, this.authConf.signOutAuto);
      }
    }

    return JSON.parse(tokenInfo) as Users;
  }
}
