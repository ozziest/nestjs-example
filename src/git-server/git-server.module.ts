import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { GitServerFactory } from './git-server.factory';
import { LoggerModule } from 'src/logger/logger.module';
import { RegistryModule } from 'src/registry/registry.module';

@Module({
  imports: [
    LoggerModule,
    HttpModule,
    RegistryModule,
    CacheModule.register({
      store: redisStore,
    }),
  ],
  controllers: [],
  providers: [GitServerFactory],
  exports: [GitServerFactory],
})
export class GitServerModule {}
