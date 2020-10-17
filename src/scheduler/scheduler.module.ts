import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { DataModule } from 'src/data/data.module';
import { LoggerModule } from 'src/logger/logger.module';
import { QueueModule } from 'src/queue/queue.module';
import { TrackerModule } from 'src/tracker/tracker.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'tasks',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    QueueModule,
    LoggerModule,
    TrackerModule,
    DataModule
  ],
  controllers: [],
  providers: [TasksService],
  exports: [TasksService]
})
export class SchedulerModule {}