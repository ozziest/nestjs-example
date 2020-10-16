import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GitServerModule } from './../git-server/git-server.module';
import { TrackerService } from './tracker.service';
import { TaskLogger } from './task-logger';
import { RegistryModule } from 'src/registry/registry.module';

@Module({
  imports: [GitServerModule, RegistryModule, TaskLogger],
  controllers: [AppController],
  providers: [TrackerService, TaskLogger],
  exports: [TaskLogger]
})
export class AppModule {}
