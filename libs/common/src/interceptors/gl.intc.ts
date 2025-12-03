import { CallHandler, ExecutionContext, HttpException, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ErrorCodes } from '../code/error/error.code';
import { Logger } from '../utils/logger';

@Injectable()
export class GlIntc implements NestInterceptor {
  constructor(private logger: Logger, private cls: ClsService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const [req, res] = context.getArgs();
    const now = Date.now();
    return next.handle().pipe(
      map((value) => {
        // Request Logging
        this.logger.msg(
          '', //null,
          [`Headers\n${JSON.stringify(req.headers, null, 2)}`, `Body\n${JSON.stringify(req.body, null, 2)}`],
          `REQ-${now.toString()}`,
        );
        return value === null ? '' : value;
      }),
      tap((value) => {
        // Response Logging
        this.logger.msg(
          '', //null,
          [`StatusCode : ${res.statusCode}`, `Body\n${JSON.stringify(value, null, 2)}`, `Time : ${Date.now() - now}ms`],
          `RES-${now.toString()}`,
        );
      }),
      catchError((err) => {
        const status = err.status || 500;
        const code = err.response?.code
          ? err.response.code
          : err.message === 'Timeout has occurred'
          ? ErrorCodes.IS999
          : ErrorCodes.UK999;
        const message = err.message || 'Unknown error';
        const cause = err.response?.cause || null;
        const params = [
          `StatusCode : ${status}`,
          `ErrMessage : ${message + (cause ? `- ${JSON.stringify(cause)}` : '')}`,
          `Headers\n${JSON.stringify(req.headers, null, 2)}`,
          `Body(Req)\n${JSON.stringify(req.body, null, 2)}`,
          `Body(Res)\n${JSON.stringify(err.response, null, 2)}`,
        ];

        if (err.stack) {
          params.push(`ErrorTrace\n${err.stack}`);
        }
        params.push(`REQUEST_ID-${this.cls.get('requestId')}`);
        params.push(
          `ERROR_FROM-${context.getArgByIndex(0).url} - ${context.getClass().name}.${context.getHandler().name}`,
        );

        // Exception Logging
        this.logger.msg('', params, `ERR-${now.toString()}`);
        const response = {
          code,
          message,
          cause,
        };
        throw new HttpException(response, status);
      }),
    );
  }
}
