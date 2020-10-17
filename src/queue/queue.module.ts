import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { TrackerModule } from 'src/tracker/tracker.module';
import { TaskConsumer } from './task.consumer';

@Module({
  imports: [
    LoggerModule,
    TrackerModule
  ],
  controllers: [],
  providers: [TaskConsumer],
  exports: [TaskConsumer]
})
export class QueueModule {}