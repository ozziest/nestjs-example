import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { HtmlBuilderService } from './html-builder.service';
import { Dependency } from 'src/registry/dependency.interface';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly htmlBuilderService: HtmlBuilderService
  ) {}
  
  async sendReport(to: string, data: Dependency[]) {
    await this
      .mailerService
      .sendMail({
        to,
        subject: 'Daily Dependency Report',
        html: this.htmlBuilderService.buildReport(data)
      })
  }
}