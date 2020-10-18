import { Job } from 'bull';
import { AnalyzeConsumer } from './analyze.consumer';

describe('AnalyzeConsumer', () => {
  let consumer: AnalyzeConsumer;
  let htmlBuilderService;
  let reportSenderQueue;
  let analyzerService;
  let appLogger;

  beforeEach(async () => {
    reportSenderQueue = jest.fn()
    analyzerService = jest.fn()
    htmlBuilderService = jest.fn()
    htmlBuilderService.buildReport = jest.fn(() => 'html-content')
    appLogger = jest.fn()
    appLogger.setContext = jest.fn()
    appLogger.debug = jest.fn()

    consumer = new AnalyzeConsumer(reportSenderQueue, analyzerService, htmlBuilderService, appLogger)
  });

  it('should be able to call analyze service correctly', async () => {
    const job = {
      data: {
        url: 'my-url',
        emails: ['1@mail.com', '2@mail.com'],
        sendEmail: true
      }
    } as Job
    
    const response = {
      isAnalyzed: true
    }

    reportSenderQueue.add = jest.fn()

    analyzerService.analyze = jest.fn(() => new Promise(resolve => resolve(response)))
    expect(await consumer.transcode(job)).toBe(response)
    expect(analyzerService.analyze.mock.calls.length).toBe(1)
    expect(analyzerService.analyze.mock.calls[0][0]).toBe('my-url')

    // ReportSenderQueue task should be added
    expect(reportSenderQueue.add.mock.calls.length).toBe(2)
    expect(reportSenderQueue.add.mock.calls[0][0].email).toBe('1@mail.com')
    expect(reportSenderQueue.add.mock.calls[0][0].html).toBe('html-content')
    expect(reportSenderQueue.add.mock.calls[1][0].email).toBe('2@mail.com')
    expect(reportSenderQueue.add.mock.calls[1][0].html).toBe('html-content')
  });
});
