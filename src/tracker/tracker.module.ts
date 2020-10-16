import { Module } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { GitServerModule } from './../git-server/git-server.module';
import { RegistryModule } from './../registry/registry.module';
import { RedisModule } from './../redis/redis.module';
import { RedisService } from './../redis/redis.service';

@Module({
  imports: [RedisModule, GitServerModule, RegistryModule],
  controllers: [],
  providers: [TrackerService, RedisService],
  exports: [TrackerService]
})
export class TrackerModule {}
