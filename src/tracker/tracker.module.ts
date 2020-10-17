import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { GitServerModule } from './../git-server/git-server.module';
import { RegistryModule } from './../registry/registry.module';
import { LoggerModule } from 'src/logger/logger.module';
import { AppLogger } from 'src/logger/app-logger';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore
    }),
    GitServerModule,
    RegistryModule,
    LoggerModule
  ],
  controllers: [],
  providers: [TrackerService, AppLogger],
  exports: [TrackerService]
})
export class TrackerModule {}
