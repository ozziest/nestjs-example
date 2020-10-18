import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Queue } from 'bull';
import * as moment from 'moment';
import { RegisterDto } from './../app/dto/register.dto';
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
      const request = new RegisterDto();
      request.url = url;
      request.emails = groups[url];
      await this.analysisQueue.add(request);
    }
  }

  toGroupList(result) {
    return result.reduce((r, a) => {
      r[a.url] = [...(r[a.url] || []), a.email];
      return r;
    }, {});
  }
}
