import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { AppLogger } from './../logger/app-logger';
import { AnalyzerService } from './../analyzer/analyzer.service';
import { HtmlBuilderService } from './../mail/html-builder.service';
import { SubscriptionDto } from './../data/dto/subscription.dto';
import { QueueAnalyze, QueueReportSender } from './../app/constants.service';

@Processor(QueueAnalyze)
export class AnalyzeConsumer {
  constructor(
    @InjectQueue(QueueReportSender) private reportSenderQueue: Queue,
    private readonly analyzerService: AnalyzerService,
    private readonly htmlBuilderService: HtmlBuilderService,
    private readonly logger: AppLogger,
  ) {
  }

  @Process()
  async transcode(job: Job<SubscriptionDto>) {
    this.logger.debug('Analyzing dependencies has been started.');
    const report = await this.analyzerService.analyze(job.data.url.toString());

    // We should add report-sender queue to send report as email
    const reportHtml = this.htmlBuilderService.buildReport(report)
    for (const email of job.data.emails) {
      this.reportSenderQueue.add({
        email: email,
        html: reportHtml  
      })
    }
    this.logger.debug('Report Sender Queue has been structured.');

    this.logger.debug('Analyzing dependencies has been completed.');
    return report;
  }
}
