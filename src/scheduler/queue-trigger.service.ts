import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Queue } from 'bull';
import * as moment from 'moment';
import { SubscriptionDto } from './../data/dto/subscription.dto';
import { SubscriptionsService } from './../data/subscription.service';

@Injectable()
export class QueueTriggerService {
  constructor(
    private readonly subscriptionService: SubscriptionsService,
    @InjectQueue('analyze') private analysisQueue: Queue,
  ) {}

  @Interval(1000 * 60 * 60)
  async handleInterval() {
    const result = await this.subscriptionService.getByTimes(
      parseInt(moment().format('HH')),
      parseInt(moment().add(1, 'hours').format('HH'))
    );
    const groups = this.toGroupList(result);

    for (const url in groups) {
      await this.analysisQueue.add({
        url: url,
        emails: groups[url],
        sendEmail: true
      });
    }
  }

  toGroupList(result) {
    return result.reduce((r, a) => {
      r[a.url] = [...(r[a.url] || []), a.email];
      return r;
    }, {});
  }
}
