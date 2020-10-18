import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { RegisterDto } from './../app/dto/register.dto';
import { AppLogger } from './../logger/app-logger';
import { AnalyzerService } from './../analyzer/analyzer.service';

@Processor('analyze')
export class AnalyzeConsumer {
  constructor(
    private readonly analyzerService: AnalyzerService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AnalyzeConsumer.name);
  }

  @Process()
  async transcode(job: Job<RegisterDto>) {
    this.logger.log('Start transcoding...');
    const result = await this.analyzerService.analyze(job.data.url);
    this.logger.log('Transcoding completed');
    return result;
  }
}
