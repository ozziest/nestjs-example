import { InjectQueue } from '@nestjs/bull';
import { Controller, Get } from '@nestjs/common';
import { Queue } from 'bull';
import { SubscriptionsService } from 'src/data/subscription.service';
import { MailService } from 'src/mail/mail.service';
import { RegisterDto } from './dto/register.dto';

@Controller()
export class AppController {
  constructor(
    @InjectQueue('analyze') private analysisQueue: Queue,
    private readonly subscriptionService: SubscriptionsService,
    private readonly mailService: MailService,
  ) {
    this.analysisQueue.resume();
  }

  @Get()
  async getIndex() {
    const request = new RegisterDto();
    request.url = 'https://github.com/adonisx/adonisx-cli';
    request.emails = ['i.ozguradem@gmail.com', 'ozgur@ozgurmail.net'];

    await this.subscriptionService.subscribeAll(request.url, request.emails);

    const task = await this.analysisQueue.add(request);
    const result = await task.finished()

    await this.mailService.sendReport('i.ozguradem@gmail.com', result)

    console.log('Done')

    return {
      request,
      result,
    };
  }
}
