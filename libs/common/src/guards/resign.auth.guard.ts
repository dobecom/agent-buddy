import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorCodes } from '../code/error/error.code';
import { Users } from '../domains/Users';
import { Logger } from '../utils/logger';

@Injectable()
export class ResignAuthGuard extends AuthGuard('jwt-resign') {
  constructor(private logger: Logger) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    this.logger.log(`1. canActivate\n>> ${request.headers.authorization}`, 'ResignGuard');
    return super.canActivate(context);
  }

  handleRequest<T>(err: unknown, users: Users /*, info: unknown*/): T {
    if (err || !users) {
      throw err || new UnauthorizedException({
        code: ErrorCodes.UA007
      });
    }
    this.logger.log(`3. handleRequest\n>> uid : ${users.id}`, 'ResignGuard');
    return users as T;
  }
}
