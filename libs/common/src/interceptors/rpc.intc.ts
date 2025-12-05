import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { ErrorCodes } from '../code/error/error.code';
import { ClsService } from 'nestjs-cls';
import { Logger } from '../utils/logger';

@Injectable()
export class RpcExceptionInterceptor implements NestInterceptor {
  constructor(private logger: Logger, private cls: ClsService) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'rpc') {
      return next.handle().pipe(
        catchError((error) => {
          this.logger.msg(
            '',
            [
              `ErrName : (${context.getClass().name.split('Controller')[0]}) ${error.response?.code ? error.response.code + '-' : ''
              }${error.name}`,
            ],
            `REQUEST_ID-${this.cls.get('requestId')}`,
          );
          if (error.status) {
            throw new RpcException(error);
          } else {
            throw new RpcException(
              new InternalServerErrorException({
                code: ErrorCodes.UK999,
                cause: error.name,
              }),
            );
          }
        }),
      );
    } else {
      return next.handle();
    }
  }
}
