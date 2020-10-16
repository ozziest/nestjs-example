import { Injectable } from '@nestjs/common';
import { Tedis } from "tedis";

@Injectable()
export class RedisService {
  private tedis: Tedis;

  constructor() {
    this.tedis = new Tedis();
  }

  getClient () {
    return this.tedis
  }
}