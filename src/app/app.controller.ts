import { InjectQueue } from '@nestjs/bull';
import { Controller, Get } from '@nestjs/common';
import { Queue } from 'bull';
import { timeStamp } from 'console';
import { TrackerService } from 'src/tracker/tracker.service';
import { RegisterDto } from './dto/register.dto'

@Controller()
export class AppController {

  constructor(
    @InjectQueue('tasks') private taskQueue: Queue,
    private readonly trackerService: TrackerService
  ) {
    this.taskQueue.resume()
  }

  @Get()
  async getIndex() {
    const request = new RegisterDto();
    request.url = 'https://github.com/adonisx/adonisx-cli'
    request.emails = ['i.ozguradem@gmail.com', 'ozgur@ozgurmail.net']

    const task = await this.taskQueue.add(
      request
    );
    await task.finished()

    // console.log('done', task)

    return {
      request
    }
  }
}
