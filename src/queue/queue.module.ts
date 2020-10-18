import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { AnalyzerModule } from 'src/analyzer/analyzer.module';
import { AnalyzeConsumer } from './analyze.consumer';
import { ReportSenderConsumer } from './report-sender.consumer';
import { BullModule } from '@nestjs/bull';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'report-sender',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    LoggerModule,
    AnalyzerModule,
    MailModule
  ],
  controllers: [],
  providers: [AnalyzeConsumer, ReportSenderConsumer],
  exports: [AnalyzeConsumer, ReportSenderConsumer],
})
export class QueueModule {}
