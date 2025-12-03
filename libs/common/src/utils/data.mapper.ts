import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { DateTimeFormatter, nativeJs } from '@js-joda/core';
import { dbConfig } from '../configs';

@Injectable()
export class DataMapper {
  private static DATE_PATTERN = DateTimeFormatter.ofPattern('yyyy-MM-dd');
  private static DATETIME_PATTERN = DateTimeFormatter.ofPattern('yyyy-MM-dd HH:mm:ss');

  constructor(
    @Inject(dbConfig.KEY)
    private config: ConfigType<typeof dbConfig>,
  ) { }

  castList<T>(data: unknown[]): any {
    let result;
    if (data.length > 0) {
      result = [];
      const values = Object.values(data);
      values.forEach((item) => {
        this.castType(item as unknown);
        result.push(item as T);
      });
      // For List
      return this.keysToCamel(result) as T;
    } else {
      return null;
    }
  }

  cast<T>(data: unknown[]): any {
    let result;
    if (data.length == 1) {
      result = data[0] as T;
      const keys = Object.keys(result);
      if (keys.length == 1) {
        // For One
        if (isNaN(Number(result[keys[0]]))) {
          // is Not Number
          return result[keys[0]];
        } else {
          return Number(result[keys[0]]);
        }
      } else {
        // For Object
        this.castType(result as unknown);
        return this.keysToCamel(result) as T;
      }
    } else {
      return null;
    }
  }

  castType(item): any { // : unknown): any {
    Object.keys(item).forEach((key) => {
      const value = item[key];
      if (this.isDate(value)) {
        const ldt = nativeJs(item[key]);
        item[key] = ldt.format(DataMapper.DATETIME_PATTERN);
      } else if (
        value !== null &&
        value !== '' &&
        (key.includes('id') || key.includes('amount') || key.includes('count')) &&
        !isNaN(Number(value))
      ) {
        // ** bigint 타입은 typescript에서 string으로 인식하므로, number 타입으로 리턴하기 위한 작업 **
        // NULL이 아니면서, 빈 문자열이 아니면서, key 이름에 id/amount/count가 들어가면서, number로 캐스팅 했을 때 유효한 값이면 number로 캐스팅한다
        // 예외 사항에 products의 amount 포함 (bigint 타입이지만 number로 캐스팅)
        // Number로 캐스팅 시 범위를 초과한 값은 손실될 수 있음
        // bigint	 8 bytes	 -9223372036854775808 to 9223372036854775807
        // javascript number    -9007199254740991 to    9007199254740991
        // integer 4 bytes            -2147483648 to         +2147483647
        item[key] = Number(value);
      }
    });
  }

  toCamel(s: string) {
    return s.replace(/([-_][a-z])/gi, ($1: string) => {
      return $1.toUpperCase().replace('-', '').replace('_', '');
    });
  }

  isObject(o: unknown) {
    return o === Object(o) && !Array.isArray(o) && typeof o !== 'function';
  }

  isDate(d) {
    return d instanceof Date;
  }

  keysToCamel(result: any): unknown {
    if (this.isObject(result)) {
      const n: any = {};

      Object.keys(result).forEach((k) => {
        n[this.toCamel(k)] = this.keysToCamel(result[k]);
      });

      return n;
    } else if (Array.isArray(result)) {
      return result.map((i) => {
        return this.keysToCamel(i);
      });
    }

    return result;
  }
}
