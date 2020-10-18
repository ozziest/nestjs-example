import { Module } from '@nestjs/common';
import { HtmlBuilderService } from './html-builder.service';
import { MailService } from './mail.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MailService, HtmlBuilderService],
  exports: [MailService, HtmlBuilderService],
})
export class MailModule {}
