import { InjectQueue } from '@nestjs/bull';
import { Controller, Get } from '@nestjs/common';
import { Queue } from 'bull';
import { SubscriptionsService } from 'src/data/subscription.service';
import { RegisterDto } from './dto/register.dto';

@Controller()
export class AppController {
  constructor(
    @InjectQueue('analyze') private analysisQueue: Queue,
    private readonly subscriptionService: SubscriptionsService,
  ) {
    this.analysisQueue.resume();
  }

  @Get()
  async getIndex() {
    const request = new RegisterDto();
    request.url = 'https://github.com/adonisx/adonisx-cli';
    request.emails = ['i.ozguradem@gmail.com', 'ozgur@ozgurmail.net'];

    // await this.subscriptionService.removeAll()
    await this.subscriptionService.subscribeAll(request.url, request.emails);
    // console.log(await this.subscriptionService.findAll())

    const task = await this.analysisQueue.add(request);

    return {
      request,
      result: await task.finished(),
    };
  }
}
