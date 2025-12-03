import { Injectable } from '@nestjs/common';

@Injectable()
export class DateModifier {
  public modifyDateTime(
    inputDate: Date,
    type: string,
    value: number,
    // 날짜 수정 시 기한의 의미를 갖는 경우(ex: inputDate로부터 2년) true : 년/월 계산 시 1일 전으로 설정
    isEndDate?: boolean,
  ): Date {
    const inputDateString = new Date(inputDate);

    switch (type) {
      case 'year':
        inputDateString.setFullYear(inputDateString.getFullYear() + value);
        isEndDate && inputDateString.setDate(inputDateString.getDate() - 1);
        break;
      case 'month':
        inputDateString.setMonth(inputDateString.getMonth() + value);
        isEndDate && inputDateString.setDate(inputDateString.getDate() - 1);
        break;
      case 'day':
        inputDateString.setDate(inputDateString.getDate() + value);
        break;
      default:
        break;
    }
    return inputDateString;
  }
}
