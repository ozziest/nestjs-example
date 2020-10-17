import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { AnalyzerModule } from 'src/analyzer/analyzer.module';
import { AnalyzeConsumer } from './analyze.consumer';

@Module({
  imports: [LoggerModule, AnalyzerModule],
  controllers: [],
  providers: [AnalyzeConsumer],
  exports: [AnalyzeConsumer],
})
export class QueueModule {}
