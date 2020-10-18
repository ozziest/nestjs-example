import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { AnalyzerModule } from 'src/analyzer/analyzer.module';
import { AnalyzeConsumer } from './analyze.consumer';
import { ReportSenderConsumer } from './report-sender.consumer';
import { BullModule } from '@nestjs/bull';
import { MailModule } from 'src/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { QueueReportSender } from 'src/app/constants.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.registerQueue({
      name: QueueReportSender,
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
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
