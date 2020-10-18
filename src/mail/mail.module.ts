import { Module } from '@nestjs/common';
import { HtmlBuilderService } from './html-builder.service';

@Module({
  imports: [],
  controllers: [],
  providers: [HtmlBuilderService],
  exports: [HtmlBuilderService],
})
export class MailModule {}
