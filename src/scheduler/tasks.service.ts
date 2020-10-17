import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Queue } from 'bull';
import { RegisterDto } from 'src/app/dto/register.dto';
import { SubscriptionsService } from 'src/data/subscription.service';

@Injectable()
export class TasksService {

  constructor (
    private readonly subscriptionService : SubscriptionsService,
    @InjectQueue('tasks') private taskQueue: Queue,
  ) {}


  @Interval(60000 * 60)
  async handleInterval() {
    const result = await this.subscriptionService.getByTimes(
      20,
      24
      // parseInt(moment().format('HH')),
      // parseInt(moment().add(1, 'hours').format('HH'))
    )
    const groups = this.toGroupList(result)

    for (const url in groups) {
      const request = new RegisterDto();
      request.url = url
      request.emails = groups[url]
      console.log(request)
      await this.taskQueue.add(request);
    }
  }

  toGroupList (result) {
    return result.reduce((r, a) => {
      r[a.url] = [...r[a.url] || [], a.email];
      return r;
    }, {});
  }
}