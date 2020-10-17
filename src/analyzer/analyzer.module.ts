import { Module } from '@nestjs/common';
import { AnalyzerService } from './analyzer.service';
import { GitServerModule } from './../git-server/git-server.module';
import { RegistryModule } from './../registry/registry.module';

@Module({
  imports: [GitServerModule, RegistryModule],
  controllers: [],
  providers: [AnalyzerService],
  exports: [AnalyzerService],
})
export class AnalyzerModule {}
