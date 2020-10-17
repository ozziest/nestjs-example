import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from './schemas/subscription.schema';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription.name) private readonly model: Model<Subscription>
  ) {}

  async subscribe(url: string, email: string): Promise<Subscription> {
    let item = await this.getSubscription(url, email)

    if (item) {
      return 
    }

    item = new this.model();
    item.url = url
    item.email = email
    item.createdAt = new Date()
    return item.save();
  }

  async getSubscription (url: string, email: string): Promise<Subscription> {
    return this.model.findOne({
      url,
      email
    }).exec()
  }

  async getByTimes (startHour: number, endHour: number) : Promise<Subscription[]> {
    return this.model
      .aggregate([
        {
          $project: {
            hour: {
              $hour: "$createdAt"
            },
            url: "$url",
            email: "$email",
            createdAt: "$createdAt"
          }
        }, 
        {
          $match: {
            hour: {
              "$gte": startHour,
              "$lte": endHour
            }
          }
        }
      ])
      .exec()
  }

  async subscribeAll (url: string, emails: string[]) {
    for (const email of emails) {
      await this.subscribe(url, email)
    }
  }

  async findAll(): Promise<Subscription[]> {
    return this.model.find().exec();
  }

  async removeAll () {
    await this.model.remove({ email: 'ozgur@ozgurmail.net' });
  }
}