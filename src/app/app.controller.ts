import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { Queue } from 'bull';
import { SubscriptionDto } from 'src/data/dto/subscription.dto';
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
  async postRegister(@Body() register: RegisterDto) {
    const data : SubscriptionDto = {
      url: register.url,
      emails: register.emails.split(';')
    }

    await this.subscriptionService.subscribeAll(data);
    const task = await this.analysisQueue.add(data);
    const report = await task.finished()

    return {
      data,
      report
    };
  }  
}
