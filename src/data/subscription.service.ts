import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppLogger } from './../logger/app-logger';
import { SubscriptionDto } from './dto/subscription.dto';
import { Subscription } from './schemas/subscription.schema';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription.name) private readonly model: Model<Subscription>,
    private readonly logger : AppLogger
  ) {
    this.logger.setContext(SubscriptionsService.name)
  }

  async subscribe(url: string, email: string): Promise<Subscription> {
    let item = await this.getSubscription(url, email);

    if (item) {
      this.logger.debug('There is already a subscription for this repository.')
      return null;
    }

    item = new this.model();
    item.url = url;
    item.email = email;
    item.createdAt = new Date();
    item.save();

    this.logger.debug('Subscription has been created')

    return item
  }

  async getSubscription(url: string, email: string): Promise<Subscription> {
    return this.model
      .findOne({
        url,
        email,
      })
      .exec();
  }

  async getByTimes(
    startHour: number,
    endHour: number,
  ): Promise<Subscription[]> {
    return this.model
      .aggregate([
        {
          $project: {
            hour: {
              $hour: '$createdAt',
            },
            url: '$url',
            email: '$email',
            createdAt: '$createdAt',
          },
        },
        {
          $match: {
            hour: {
              $gte: startHour,
              $lte: endHour,
            },
          },
        },
      ])
      .exec();
  }

  async subscribeAll(data : SubscriptionDto) {
    for (const email of data.emails) {
      await this.subscribe(data.url, email);
    }
  }
}
