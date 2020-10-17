import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GitServerModule } from './../git-server/git-server.module';
import { RegistryModule } from 'src/registry/registry.module';
import { TrackerModule } from 'src/tracker/tracker.module';
import { TrackerService } from 'src/tracker/tracker.service';
import { RedisModule } from 'src/redis/redis.module';
import { BullModule } from '@nestjs/bull';
import { TaskConsumer } from './consumers/task.consumer';
import { LoggerModule } from 'src/logger/logger.module';
import { AppLogger } from 'src/logger/app-logger';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from 'src/data/data.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CacheModule.register({
      store: redisStore
    }),
    RedisModule,
    BullModule.registerQueue({
      name: 'tasks',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    TrackerModule,
    GitServerModule,
    RegistryModule,
    LoggerModule,
    MongooseModule.forRoot('mongodb://localhost/test'),
    CatsModule
  ],
  controllers: [AppController],
  providers: [TrackerService, AppLogger, TaskConsumer],
  exports: [AppLogger]
})
export class AppModule {}
