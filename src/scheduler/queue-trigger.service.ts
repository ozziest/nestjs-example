import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Queue } from 'bull';
import * as moment from 'moment';
import { SubscriptionsService } from './../data/subscription.service';
import { AnalyzerPeriod, AnalyzerTimeout, QueueAnalyze } from './../app/constants.service';
import { AppLogger } from './../logger/app-logger';

@Injectable()
export class QueueTriggerService {
  constructor(
    private readonly subscriptionService: SubscriptionsService,
    @InjectQueue(QueueAnalyze) private analysisQueue: Queue,
    private readonly logger : AppLogger
  ) {
  }

  @Interval(AnalyzerTimeout)
  async handleInterval() {
    this.logger.debug('Fetching subscriptions for the current period')
    const result = await this.subscriptionService.getByTimes(
      parseInt(moment().format('HH')),
      parseInt(moment().add(AnalyzerPeriod, 'minutes').format('HH'))
    );

    if (result.length === 0) {
      this.logger.debug('There is nothing to do for the current period.')
      return
    }

    const groups = this.toGroupList(result);
    for (const url in groups) {
      await this.analysisQueue.add({
        url: url,
        emails: groups[url],
        sendEmail: true
      });
    }

    this.logger.debug('Subscription analysis has been added to the queue.')
  }

  toGroupList(result) {
    return result.reduce((r, a) => {
      r[a.url] = [...(r[a.url] || []), a.email];
      return r;
    }, {});
  }
}
