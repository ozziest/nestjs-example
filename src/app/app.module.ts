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
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    CacheModule.register({
      store: redisStore,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    BullModule.registerQueue(
      {
        name: 'analyze',
        redis: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
        },
      }
    ),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_IS_SECURE,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD
        },
      },
      defaults: {
        from: process.env.SMTP_FROM,
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
