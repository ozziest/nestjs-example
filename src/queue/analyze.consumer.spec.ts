import { Job } from 'bull';
import { AnalyzeConsumer } from './analyze.consumer';

describe('AnalyzeConsumer', () => {
  let consumer: AnalyzeConsumer;
  let analyzerService;
  let appLogger;

  beforeEach(async () => {
    analyzerService = jest.fn()
    appLogger = jest.fn()
    appLogger.setContext = jest.fn()
    appLogger.log = jest.fn()

    consumer = new AnalyzeConsumer(analyzerService, appLogger)
  });

  it('should be able to call analyze service correctly', async () => {
    const job = {
      data: {
        url: 'my-url'
      }
    } as Job
    
    const response = {
      isAnalyzed: true
    }

    analyzerService.analyze = jest.fn(() => new Promise(resolve => resolve(response)))
    expect(await consumer.transcode(job)).toBe(response)
    expect(analyzerService.analyze.mock.calls.length).toBe(1)
    expect(analyzerService.analyze.mock.calls[0][0]).toBe('my-url')
  });
});
