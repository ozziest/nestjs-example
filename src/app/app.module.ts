import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GitServerModule } from './../git-server/git-server.module';
import { RegistryModule } from 'src/registry/registry.module';
import { TrackerModule } from 'src/tracker/tracker.module';
import { TrackerService } from 'src/tracker/tracker.service';
import { LoggerModule } from 'src/logger/logger.module';
import { AppLogger } from 'src/logger/app-logger';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { DataModule } from 'src/data/data.module';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { QueueModule } from 'src/queue/queue.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CacheModule.register({
      store: redisStore
    }),
    BullModule.registerQueue({
      name: 'tasks',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    QueueModule,
    TrackerModule,
    GitServerModule,
    RegistryModule,
    LoggerModule,
    MongooseModule.forRoot('mongodb://localhost/test'),
    DataModule,
    SchedulerModule
  ],
  controllers: [AppController],
  providers: [TrackerService, AppLogger],
  exports: [AppLogger]
})
export class AppModule {}
