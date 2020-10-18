import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { RegistryFactory } from './registery.factory';
import { LoggerModule } from 'src/logger/logger.module';
import { SemanticService } from './semantic.service';

@Module({
  imports: [
    HttpModule,
    CacheModule.register({
      store: redisStore,
    }),
    LoggerModule,
  ],
  controllers: [],
  providers: [RegistryFactory, SemanticService],
  exports: [RegistryFactory],
})
export class RegistryModule {}
