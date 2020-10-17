import { Controller, Get } from '@nestjs/common';
import { TrackerService } from 'src/tracker/tracker.service';
import { RegisterDto } from './dto/register.dto'

@Controller()
export class AppController {

  constructor(
    private readonly trackerService: TrackerService
  ) {}

  @Get()
  async getIndex() {
    const request = new RegisterDto();
    request.url = 'https://github.com/adonisx/adonisx'
    request.emails = ['i.ozguradem@gmail.com', 'ozgur@ozgurmail.net']

    this.trackerService.createSubscription(request.url, request.emails)

    return {
      status: true,
      request,
      outdates: await this.trackerService.analyze(request.url),
      repositories: this.trackerService.getRepositories()
    }
  }
}
