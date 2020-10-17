import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from './schemas/subscription.schema';
import { TimeService } from './time.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription.name) private readonly model: Model<Subscription>,
    private readonly timeService: TimeService
  ) {}

  async create(url: string, email: string): Promise<Subscription> {
    const item = new this.model();
    item.url = url
    item.email = email
    item.time = this.timeService.now()
    return item.save();
  }

  async createAll (url: string, emails: string[]) {
    for (const email of emails) {
      await this.create(url, email)
    }
  }

  async findAll(): Promise<Subscription[]> {
    return this.model.find().exec();
  }
}