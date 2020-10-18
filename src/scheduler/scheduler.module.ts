import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { DataModule } from 'src/data/data.module';
import { LoggerModule } from 'src/logger/logger.module';
import { QueueModule } from 'src/queue/queue.module';
import { AnalyzerModule } from 'src/analyzer/analyzer.module';
import { QueueTriggerService } from './queue-trigger.service';
import { ConfigModule } from '@nestjs/config';
import { QueueAnalyze } from './../app/constants.service';
import { SchedulerLogger } from './scheduler.logger';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.registerQueue({
      name: QueueAnalyze,
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    QueueModule,
    AnalyzerModule,
    DataModule
  ],
  controllers: [],
  providers: [QueueTriggerService, SchedulerLogger],
  exports: [QueueTriggerService],
})
export class SchedulerModule {}
