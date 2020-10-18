import { InjectQueue } from '@nestjs/bull';
import { Controller, Get, Post, Render } from '@nestjs/common';
import { Queue } from 'bull';
import { SubscriptionsService } from 'src/data/subscription.service';
import { RegisterDto } from './dto/register.dto';

@Controller()
export class AppController {
  constructor(
    @InjectQueue('analyze') private analysisQueue: Queue,
    private readonly subscriptionService: SubscriptionsService,
  ) { }

  @Get()
  @Render('index')
  async getIndex() {
    return { message: 'Hello world!' };
  }

  @Post('register')
  @Render('success')
  async postRegister() {
    const request = new RegisterDto();
    request.url = 'https://github.com/adonisx/adonisx-cli';
    request.emails = ['i.ozguradem@gmail.com'];

    await this.subscriptionService.subscribeAll(request.url, request.emails);

    const task = await this.analysisQueue.add(request);
    const report = await task.finished()

    return {
      request,
      report
    };
  }  
}
