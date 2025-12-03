import { HttpService } from '@nestjs/axios';
import { HttpStatus, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import * as querystring from 'querystring';
import * as tunnel from 'tunnel';
import { InjectRedis } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
import { appConfig, extconnConfig } from '../configs';
import { Logger } from '../utils/logger';

@Injectable()
export class AxiosGateway {
  private timeout = 15000;
  private RETRY_LIMIT = 10;
  private authorization = {
    accessToken: '', // null,
    expiresOn: 0,
    tokenType: 'Bearer',
  };

  constructor(
    @Inject(extconnConfig.KEY)
    private exConfig: ConfigType<typeof extconnConfig>,
    @Inject(appConfig.KEY)
    private config: ConfigType<typeof appConfig>,
    private httpService: HttpService,
    private logger: Logger,
    @InjectRedis() private readonly cache: Redis,
  ) {}

  async get(endpoint: string, params: Map<string, string>, header?: Map<string, string>) {
    let response;
    try {
      const query = querystring.stringify(Object.fromEntries(params));
      const url =
        this.config.environment === 'local'
          ? 'http://' + this.config.host + ':' + this.config.port + endpoint
          : this.config.host + endpoint;
      // const keyHeader = { 'X-API-KEY': this.config.node.key };
      const addHeader = header ? Object.fromEntries(header) : {};
      // const authHeader = await this.getAuthorizationHeader();
      const reqHeaders = {
        // ...keyHeader,
        ...addHeader,
        // ...authHeader,
      };
      const httpsAgent = this.exConfig.proxy.pass
        ? tunnel.httpsOverHttp({
            proxy: {
              host: this.exConfig.proxy.host,
              port: this.exConfig.proxy.port,
            },
          })
        : null;
      this.logger.msg(
        'Request - GET',
        [`* URL : ${url}`, `* HEADERS\n${JSON.stringify(reqHeaders, null, 2)}`],
        'ExtConn',
      );
      const { data, status, headers } = await this.httpService.axiosRef.get(url, {
        headers: reqHeaders,
        validateStatus: () => true,
        httpsAgent,
        timeout: this.timeout,
      });
      const logStack = [
        `* URL : ${url}`,
        `* HEADERS\n${JSON.stringify(headers, null, 2)}`,
        `* STATUS : ${status}`,
        `* RESPONSE\n${JSON.stringify(data, null, 2)}`,
      ];
      if (
        !data ||
        status < HttpStatus.OK /** Tmp Code */ ||
        (status != HttpStatus.BAD_REQUEST && status != HttpStatus.NOT_FOUND && status >= HttpStatus.AMBIGUOUS)
        //|| status >= HttpStatus.AMBIGUOUS
      ) {
        this.logger.msg('Response - GET (Fail)', logStack, 'ExtConn');
        throw new InternalServerErrorException('EXTCONN_EXCEPTION');
      } else {
        response = data;
      }
      this.logger.msg('Response - GET', logStack, 'ExtConn');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return response;
  }

  async post(endpoint: string, body: any, header?: any) {
    let response;
    // body = {
    //   businessInvestments: {
    //     id: 1,
    //   },
    // };
    // endpoint = '/business/investments/view';
    try {
      const url =
        this.config.environment === 'local'
          ? 'http://' + this.config.host + ':' + this.config.port + endpoint
          : this.config.host + endpoint;
      //const keyHeader = { 'X-API-KEY': this.config.mobility.key };
      const keyHeader = {};
      const addHeader = header ? header : {};
      // const authHeader = await this.getAuthorizationHeader();
      const reqHeaders = {
        ...keyHeader,
        ...addHeader,
        //  ...authHeader
      };
      const httpsAgent = this.exConfig.proxy.pass
        ? tunnel.httpsOverHttp({
            proxy: {
              host: this.exConfig.proxy.host,
              port: this.exConfig.proxy.port,
            },
          })
        : null;

      this.logger.msg(
        'Request - POST',
        [
          `* URL : ${url}`,
          `* HEADERS\n${JSON.stringify(reqHeaders, null, 2)}`,
          `* BODY\n${JSON.stringify(body, null, 2)}`,
        ],
        'ExtConn',
      );
      const { data, status, headers } = await this.httpService.axiosRef.post(url, body, {
        headers: reqHeaders,
        validateStatus: () => true,
        httpsAgent,
        timeout: this.timeout,
      });
      const logStack = [
        `* URL : ${url}`,
        `* HEADERS\n${JSON.stringify(headers, null, 2)}`,
        `* STATUS : ${status}`,
        `* RESPONSE\n${JSON.stringify(data, null, 2)}`,
      ];
      if (
        !data ||
        status < HttpStatus.OK /** Tmp Code */ ||
        (status != HttpStatus.BAD_REQUEST && status != HttpStatus.NOT_FOUND && status >= HttpStatus.AMBIGUOUS)
        //|| status >= HttpStatus.AMBIGUOUS
      ) {
        this.logger.msg('Response - POST (Fail)', logStack, 'ExtConn');
        throw new InternalServerErrorException('EXTCONN_EXCEPTION');
      } else {
        response = data;
      }
      this.logger.msg('Response - POST', logStack, 'ExtConn');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return response;
  }

  private async requestToken() {
    let response;
    try {
      const url = this.config.host + '/oauth2/token';
      const reqHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const reqBody = {
        grant_type: 'client_credentials',
        // client_id: this.exConfig.node.clientId,
        // client_secret: this.exConfig.node.clientSecret,
      };
      const httpsAgent = this.exConfig.proxy.pass
        ? tunnel.httpsOverHttp({
            proxy: {
              host: this.exConfig.proxy.host,
              port: this.exConfig.proxy.port,
            },
          })
        : null;

      this.logger.msg(
        'Request - POST',
        [
          `* URL : ${url}`,
          `* HEADERS\n${JSON.stringify(reqHeaders, null, 2)}`,
          `* BODY\n${JSON.stringify(reqBody, null, 2)}`,
        ],
        'ExtConn',
      );

      const { data, status, headers } = await this.httpService.axiosRef.post(url, reqBody, {
        headers: reqHeaders,
        validateStatus: () => true,
        httpsAgent,
        timeout: this.timeout,
      });

      const logStack = [
        `* URL : ${url}`,
        `* HEADERS\n${JSON.stringify(headers, null, 2)}`,
        `* STATUS : ${status}`,
        `* RESPONSE\n${JSON.stringify(data, null, 2)}`,
      ];
      if (
        !data ||
        status < HttpStatus.OK /** Tmp Code */ ||
        (status != HttpStatus.BAD_REQUEST && status != HttpStatus.NOT_FOUND && status >= HttpStatus.AMBIGUOUS)
        //|| status >= HttpStatus.AMBIGUOUS
      ) {
        this.logger.msg('Response - POST (Fail)', logStack, 'ExtConn');
        throw new InternalServerErrorException('EXTCONN_EXCEPTION');
      } else {
        response = data;
      }
      await this.cache.set('node:at', response.access_token, 'EX', response.expires_in);
      this.authorization.accessToken = response.access_token;
      this.authorization.expiresOn = Date.now() + parseInt(response.expires_in) * 1000;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async getAuthorizationHeader() {
    if (!this.authorization.accessToken) {
      // 토큰이 메모리에 없으면 캐시에서 가져옴
      const token = await this.cache.get('node:at');
      //캐시에 없으면 토큰 발급 요청
      if (!token) {
        await this.requestToken();
      } else {
        //캐시에 있으면 메모리에 저장
        this.authorization.accessToken = token;
      }
    } else {
      // 토큰이 있는데 만료되었으면 토큰 재발급 요청 (Token 만료 10분 전에 재발급)
      if (this.authorization.expiresOn < Date.now() + 10 * 60 * 1000) {
        await this.requestToken();
      }
    }
    return this.authorization.accessToken
      ? {
          Authorization: `Bearer ${this.authorization.accessToken}`,
        }
      : {};
  }
}
