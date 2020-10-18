import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Queue } from 'bull';
import * as moment from 'moment';
import { SubscriptionsService } from './../data/subscription.service';
import { AnalyzerPeriod, AnalyzerTimeout, QueueAnalyze } from './../app/constants.service';

@Injectable()
export class QueueTriggerService {
  constructor(
    private readonly subscriptionService: SubscriptionsService,
    @InjectQueue(QueueAnalyze) private analysisQueue: Queue
  ) {}

  @Interval(AnalyzerTimeout)
  async handleInterval() {
    const result = await this.subscriptionService.getByTimes(
      parseInt(moment().format('HH')),
      parseInt(moment().add(AnalyzerPeriod, 'minutes').format('HH'))
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
