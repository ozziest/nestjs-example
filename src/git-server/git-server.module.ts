import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { RegistryFactory } from 'src/registry/registery.factory';
import { GitServerFactory } from './git-server.factory';
import { LoggerModule } from 'src/logger/logger.module';
import { AppLogger } from 'src/logger/app-logger';

@Module({
  imports: [
    LoggerModule,
    HttpModule,
    CacheModule.register({
      store: redisStore
    })
  ],
  controllers: [],
  providers: [GitServerFactory, RegistryFactory, AppLogger],
  exports: [GitServerFactory, RegistryFactory]
})
export class GitServerModule {}
