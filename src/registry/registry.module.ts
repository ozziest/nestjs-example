import { HttpModule, Module } from '@nestjs/common';
import { RegistryFactory } from './registery.factory';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [RegistryFactory],
  exports: [RegistryFactory]
})
export class RegistryModule {}
