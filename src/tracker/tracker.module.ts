import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { GitServerModule } from './../git-server/git-server.module';
import { RegistryModule } from './../registry/registry.module';
import { RedisModule } from './../redis/redis.module';
import { RedisService } from './../redis/redis.service';
import { LoggerModule } from 'src/logger/logger.module';
import { AppLogger } from 'src/logger/app-logger';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore
    }),
    RedisModule,
    GitServerModule,
    RegistryModule,
    LoggerModule
  ],
  controllers: [],
  providers: [TrackerService, RedisService, AppLogger],
  exports: [TrackerService]
})
export class TrackerModule {}
