import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { AppLogger } from './../logger/app-logger';
import { ReportSenderDto } from './dto/report-sender.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { QueueReportSender } from 'src/app/constants.service';

@Processor(QueueReportSender)
export class ReportSenderConsumer {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: AppLogger,
  ) {
  }

  @Process()
  async transcode(job: Job<ReportSenderDto>) {
    this.logger.debug('Report Sender is started to work.');
    await this
      .mailerService
      .sendMail({
        to: job.data.email,
        subject: 'Daily Dependency Report',
        html: job.data.html
      })
    this.logger.debug('Report Sender is succed!');
  }
}
