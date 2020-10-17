import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeService {

  now (): number {
    const today = new Date();
    return parseInt(today.getHours() + '' + today.getMinutes())
  }

}