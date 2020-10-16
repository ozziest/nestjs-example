import { Controller, Get } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto'
import { TaskLogger } from './task-logger';
import { TrackerService } from './tracker.service';

@Controller()
export class AppController {

  constructor(
    private readonly trackerService: TrackerService,
    private readonly logger: TaskLogger
  ) {}

  @Get()
  async getIndex() {
    const request = new RegisterDto();
    request.url = 'https://github.com/adonisx/adonisx'
    request.emails = ['i.ozguradem@gmail.com']

    this.logger.log('Tracker Service is starting to analyze the repository.')

    return {
      status: true,
      request,
      outdates: await this.trackerService.analyze(request.url)
    }
  }
}
