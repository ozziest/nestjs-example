import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GitServerModule } from './../git-server/git-server.module';
import { TaskLogger } from './task-logger';
import { RegistryModule } from 'src/registry/registry.module';
import { TrackerModule } from 'src/tracker/tracker.module';
import { TrackerService } from 'src/tracker/tracker.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    RedisModule,
    TrackerModule,
    GitServerModule,
    RegistryModule,
    TaskLogger,
  ],
  controllers: [AppController],
  providers: [TrackerService, TaskLogger],
  exports: [TaskLogger]
})
export class AppModule {}
