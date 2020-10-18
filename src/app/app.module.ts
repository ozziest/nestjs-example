import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GitServerModule } from './../git-server/git-server.module';
import { RegistryModule } from 'src/registry/registry.module';
import { AnalyzerModule } from 'src/analyzer/analyzer.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { DataModule } from 'src/data/data.module';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { QueueModule } from 'src/queue/queue.module';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CacheModule.register({
      store: redisStore,
    }),
    MongooseModule.forRoot('mongodb://localhost/test'),
    BullModule.registerQueue({
      name: 'analyze',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.mailgun.org',
        port: 465,
        secure: true,
        auth: {
          user: 'ozgur@ozgurmail.net',
          pass: 'a2b97eb11af3791ee6a20a43d442a612-2fbe671d-78aab731'
        },
      },
      defaults: {
        from:'"Özgür Adem Işıklı" <ozgur@ozgurmail.net>',
      }
    }),
    QueueModule,
    AnalyzerModule,
    GitServerModule,
    RegistryModule,
    LoggerModule,
    DataModule,
    SchedulerModule,
    MailModule
  ],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule {}
