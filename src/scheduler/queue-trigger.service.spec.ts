import { QueueTriggerService } from "./queue-trigger.service";

describe('QueueTriggerService', () => {
  let service: QueueTriggerService;
  let subscriptionService;
  let analysisQueue;
  let logger;

  const subscriptions = [
    { url: 'repo1', email: '1@mail.com' },
    { url: 'repo2', email: '2@mail.com' },
    { url: 'repo1', email: '3@mail.com' }
  ]

  beforeEach(async () => {
    subscriptionService = jest.fn()
    analysisQueue = jest.fn()
    logger = jest.fn()
    logger.setContext = jest.fn()
    logger.debug = jest.fn()
    service = new QueueTriggerService(subscriptionService, analysisQueue, logger)
  });

  it('should be able to group subscription by the repository url', async () => {
    const result = service.toGroupList(subscriptions)

    expect(result).not.toBeNull()
    expect(result.repo1).not.toBeUndefined()
    expect(result.repo2).not.toBeUndefined()
    expect(result.repo1.length).toBe(2)
    expect(result.repo2.length).toBe(1)
    expect(result.repo1[0]).toBe('1@mail.com')
    expect(result.repo1[1]).toBe('3@mail.com')
    expect(result.repo2[0]).toBe('2@mail.com')
  });

  it('should be able to create queue tasks by the subscription list', async () => {
    subscriptionService.getByTimes = jest.fn(() => new Promise(resolve => resolve(subscriptions)))
    analysisQueue.add = jest.fn(() => new Promise(resolve => resolve()))
    await service.handleInterval()
    expect(subscriptionService.getByTimes.mock.calls.length).toBe(1)
    expect(subscriptionService.getByTimes.mock.calls[0][0]).toBe((new Date).getHours())
    let nextHours = (new Date).getHours() + 1
    if (nextHours === 24) {
      nextHours = 0
    }
    expect(subscriptionService.getByTimes.mock.calls[0][1]).toBe(nextHours)

    expect(analysisQueue.add.mock.calls.length).toBe(2)
    expect(analysisQueue.add.mock.calls[0][0].url).toBe('repo1')
    expect(analysisQueue.add.mock.calls[0][0].emails.length).toBe(2)
    expect(analysisQueue.add.mock.calls[1][0].url).toBe('repo2')
    expect(analysisQueue.add.mock.calls[1][0].emails.length).toBe(1)
  })
});
