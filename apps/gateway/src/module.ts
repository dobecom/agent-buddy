import { CommonModule } from '@app/common/common.module';
import { HttpExceptionFilter } from '@app/common/filters/http-exception.filter';
import { GlIntc } from '@app/common/interceptors/gl.intc';
import { AUTH_SERVICE_PROXY, CASE_SERVICE_PROXY } from '@app/common/providers/proxy/services.proxy';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { nanoid } from 'nanoid';
import { ClsModule } from 'nestjs-cls';
import { CaseGateway } from './gateways/case.gateway';
import { AuthGateway } from './gateways/auth.gateway';

@Module({
  imports: [
    CommonModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup: (cls, req) => {
          cls.set('requestId', nanoid(12));
        },
      },
    }),
  ],
  controllers: [AuthGateway, CaseGateway],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlIntc,
    },
    AUTH_SERVICE_PROXY,
    CASE_SERVICE_PROXY
  ],
})
export class GatewayModule {}
