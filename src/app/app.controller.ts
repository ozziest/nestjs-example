import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { Queue } from 'bull';
import { AnalyzerService } from 'src/analyzer/analyzer.service';
import { SubscriptionDto } from 'src/data/dto/subscription.dto';
import { SubscriptionsService } from 'src/data/subscription.service';
import { QueueAnalyze } from './constants.service';
import { RegisterDto } from './dto/register.dto';

@Controller()
export class AppController {
  constructor(
    @InjectQueue(QueueAnalyze) private analysisQueue: Queue,
    private readonly subscriptionService: SubscriptionsService,
    private readonly analyzerService: AnalyzerService
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
      url: new URL(register.url),
      emails: register.emails.split(';').filter(email => email.trim().length > 0),
    }

    await this.subscriptionService.subscribeAll(data);
    const report = await this.analyzerService.analyze(data.url.toString())

    return {
      data,
      report
    };
  }  
}
