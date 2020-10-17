import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { RegisterDto } from 'src/app/dto/register.dto';
import { AppLogger } from 'src/logger/app-logger';
import { TrackerService } from 'src/tracker/tracker.service';

@Processor('tasks')
export class TaskConsumer {

  constructor (
    private readonly trackerService: TrackerService,
    private readonly logger: AppLogger
  ) {
    this.logger.setContext(TaskConsumer.name)
  }

  @Process()
  async transcode(job: Job<RegisterDto>) {
    this.logger.log('Start transcoding...');
    const result = await this.trackerService.analyze(job.data.url)
    this.logger.log('Transcoding completed');
    return result;
  }
 
}