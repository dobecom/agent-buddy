import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import * as Crypto from 'crypto-js';
import { ErrorCodes } from '../code/error/error.code';
import { appConfig } from '../configs';

@Injectable()
export class Aes256 {
  constructor(
    @Inject(appConfig.KEY)
    private config: ConfigType<typeof appConfig>,
  ) {}

  /** Use Case 
// Encode
const encV = encAES('plain_text', encKey, encIV);
const encV2 = encBase64(encV);
console.log(`endode str : ${encV2}`);
// Decode
const decV2 = decBase64(encV2);
const decV = decAES(decV2, encKey, encIV);
console.log(`decode str : ${decV}`);
   */

  encAES(str, key, iv) {
    const cipher = Crypto.AES.encrypt(str, Crypto.enc.Utf8.parse(key), {
      iv: Crypto.enc.Utf8.parse(iv),
      padding: Crypto.pad.Pkcs7,
      mode: Crypto.mode.CBC,
    });
    return cipher.toString();
  }

  decAES = (str, key, iv) => {
    const cipher = Crypto.AES.decrypt(str, Crypto.enc.Utf8.parse(key), {
      iv: Crypto.enc.Utf8.parse(iv),
      padding: Crypto.pad.Pkcs7,
      mode: Crypto.mode.CBC,
    });
    return cipher.toString(Crypto.enc.Utf8);
  };

  encBase64 = (str) => {
    const wordArray = Crypto.enc.Utf8.parse(str);
    return Crypto.enc.Base64.stringify(wordArray);
  };

  decBase64 = (str) => {
    try {
      const parsedWordArray = Crypto.enc.Base64.parse(str);
      return parsedWordArray.toString(Crypto.enc.Utf8);
    } catch (err) {
      if (err.message === 'Malformed UTF-8 data')
        throw new InternalServerErrorException({
          code: ErrorCodes.IS008,
        });
      throw err;
    }
  };
}
