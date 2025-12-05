import mqConfig from '@app/common/configs/mq.config';
import { ConfigService, ConfigType } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

const AUTH_SERVICE_PROXY = {
  provide: 'AUTH_SERVICE',
  useFactory: (config: ConfigService) => {
    const mq = config.get<ConfigType<typeof mqConfig>>('mq');
    if (!mq) {
      throw new Error('MQ configuration is not defined');
    }

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${mq.user}:${mq.password}@${mq.host}:${mq.port}`],
        queue: 'auth',
        noAck: true, // true인 경우, Consumer의 메시지 수신응답을 받지 않음
        queueOptions: {
          durable: true, // true인 경우, 브로커 서버가 재시작되어도 기존 Queue를 보존
        },
        // prefetchCount: 1 // 1인 경우, 연결된 Consumer는 동시에 1개의 작업만 처리할 수 있음
      },
    });
  },
  inject: [ConfigService],
};

const CASE_SERVICE_PROXY = {
  provide: 'CASE_SERVICE',
  useFactory: (config: ConfigService) => {
    const mq = config.get<ConfigType<typeof mqConfig>>('mq');
    if (!mq) {
      throw new Error('MQ configuration is not defined');
    }

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${mq.user}:${mq.password}@${mq.host}:${mq.port}`],
        queue: 'case',
        noAck: true,
        queueOptions: {
          durable: true,
        },
      },
    });
  },
  inject: [ConfigService],
};

export {
  AUTH_SERVICE_PROXY,
  CASE_SERVICE_PROXY,
};
