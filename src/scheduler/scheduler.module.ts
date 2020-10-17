import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { DataModule } from 'src/data/data.module';
import { LoggerModule } from 'src/logger/logger.module';
import { QueueModule } from 'src/queue/queue.module';
import { AnalyzerModule } from 'src/analyzer/analyzer.module';
import { QueueTriggerService } from './queue-trigger.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'analyze',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    QueueModule,
    LoggerModule,
    AnalyzerModule,
    DataModule,
  ],
  controllers: [],
  providers: [QueueTriggerService],
  exports: [QueueTriggerService],
})
export class SchedulerModule {}
