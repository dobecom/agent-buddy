import { Injectable } from '@nestjs/common';

export enum MaskType {
  NAME,
  MOBILE,
  EMAIL,
  WALLET_ADDRESS,
}

@Injectable()
export class DataMasker {
  constructor() {}

  public applyMask(value: string, maskType: MaskType) {
    switch (maskType) {
      case MaskType.NAME:
        return this.maskName(value);
      case MaskType.MOBILE:
        return this.maskMobile(value);
      case MaskType.EMAIL:
        return this.maskEmail(value);
      case MaskType.WALLET_ADDRESS:
        return this.maskWalletAddress(value);
      default:
        return value;
    }
  }

  private maskName(name: string): string {
    // masking name only except for a first character and a last character
    if (name.length < 3) return name;
    const maskedPart = name.substring(1, name.length - 1).replace(/./g, '*');
    return name.substring(0, 1) + maskedPart + name.substring(name.length - 1);
  }

  private maskMobile(mobile: string): string {
    // masking mobile phone number only 4 characters from the end
    if (mobile.length < 5) return mobile;
    const maskedNumberPart = mobile.substring(mobile.length - 4, mobile.length).replace(/./g, '*');
    return mobile.substring(0, mobile.length - 4) + maskedNumberPart;
  }

  private maskEmail(email: string): string {
    // masking email after 2 characters
    const emailSplit = email.split('@');
    if (emailSplit[0].length < 3) return emailSplit[0] + '@' + emailSplit[1];
    const emailMaskedPart = emailSplit[0].substring(2).replace(/./g, '*');
    return emailSplit[0].substring(0, 2) + emailMaskedPart + '@' + emailSplit[1];
  }

  private maskWalletAddress(walletAddress: string): string {
    // first 4characters and last 4characters are visible, the rest is "......"
    if (walletAddress.length < 9) return walletAddress;
    return walletAddress.substring(0, 4) + '......' + walletAddress.substring(walletAddress.length - 4);
  }
}
