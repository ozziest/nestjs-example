import { HttpModule, Module } from '@nestjs/common';
import { RegistryFactory } from 'src/registry/registery.factory';
import { GitServerFactory } from './git-server.factory';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [GitServerFactory, RegistryFactory],
  exports: [GitServerFactory, RegistryFactory]
})
export class GitServerModule {}
