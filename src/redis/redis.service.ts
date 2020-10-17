import { Injectable } from '@nestjs/common';
import { Tedis } from "tedis";

@Injectable()
export class RedisService {
  private tedis: Tedis;

  connect () {
    this.tedis = new Tedis()
  }

  getClient () {
    if (!this.tedis) {
      this.connect()
    }

    return this.tedis
  }
}