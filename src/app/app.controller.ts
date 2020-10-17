import { InjectQueue } from '@nestjs/bull';
import { Controller, Get } from '@nestjs/common';
import { Queue } from 'bull';
import { SubscriptionsService } from 'src/data/subscription.service';
import { RegisterDto } from './dto/register.dto'

@Controller()
export class AppController {

  constructor(
    @InjectQueue('tasks') private taskQueue: Queue,
    private readonly subscriptionService : SubscriptionsService
  ) {
    this.taskQueue.resume()
  }

  @Get()
  async getIndex() {

    const request = new RegisterDto();
    request.url = 'https://github.com/adonisx/adonisx-cli'
    request.emails = ['i.ozguradem@gmail.com', 'ozgur@ozgurmail.net']

    await this.subscriptionService.createAll(request.url, request.emails)

    const task = await this.taskQueue.add(
      request
    );

    return {
      request,
      result: await task.finished()
    }
  }
}
