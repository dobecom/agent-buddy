import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { Aes256 } from '../utils/aes256';
import { Logger } from '../utils/logger';
import { AxiosGateway } from './axios.gateway';

@Module({
  imports: [HttpModule],
  providers: [Logger, Aes256, AxiosGateway],
  exports: [AxiosGateway],
})
export class AxiosModule {}
