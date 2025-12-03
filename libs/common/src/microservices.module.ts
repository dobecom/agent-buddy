import { Global, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      interceptor: {
        mount: true,
        setup: (cls, req) => {
          cls.set('requestId', req.switchToRpc().getData().requestId);
        },
      },
    }),
  ],
})
export class MicroservicesModule {}
