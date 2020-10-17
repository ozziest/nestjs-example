import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { TrackerService } from 'src/tracker/tracker.service';
import { RegisterDto } from '../dto/register.dto';

@Processor('tasks')
export class TaskConsumer {

  private readonly logger = new Logger(TaskConsumer.name);

  constructor (private readonly trackerService: TrackerService) {}

  @Process()
  async transcode(job: Job<RegisterDto>) {
    this.logger.debug('Start transcoding...');
    this.trackerService.createSubscription(job.data.url, job.data.emails)
    const result = {
      outdates: await this.trackerService.analyze(job.data.url),
      repositories: this.trackerService.getRepositories()
    }

    this.logger.debug('Transcoding completed');
    return result;
  }
 
}