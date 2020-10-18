import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { url } from 'inspector';
import { AppLogger } from './../logger/app-logger';
import { SubscriptionDto } from './dto/subscription.dto';
import { Subscription } from './schemas/subscription.schema';
import { SubscriptionsService } from './subscription.service';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let model;
  let item;
  let logger;

  beforeEach(async () => {
    model = jest.fn()
    logger = jest.fn()
    logger.debug = jest.fn()
    logger.setContext = jest.fn()

    const module = await Test.createTestingModule({
        providers: [
          SubscriptionsService,
          {
            provide: getModelToken(Subscription.name),
            useValue: model,
          },
          {
            provide: AppLogger,
            useValue: logger
          }
        ],
      }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('should be able to get if there is any subscription', async () => {
    model.findOne = jest.fn(() => model)
    model.exec = jest.fn(() => new Promise((resolve) => { resolve({ url: 'exec-url' }) }))
    const result = await service.getSubscription('my-url', 'email@mail.com')
    expect(result.url).toBe('exec-url')

    expect(model.findOne.mock.calls.length).toBe(1)
    expect(model.findOne.mock.calls[0][0].url).toBe('my-url')
    expect(model.findOne.mock.calls[0][0].email).toBe('email@mail.com')
  });

  it('should be able to create a new subscription', async () => {
    item = jest.fn()
    item.save = jest.fn(() => new Promise((resolve) => { resolve(item) }))

    service.getSubscription = jest.fn(() => new Promise((resolve) => resolve(null)))
    model.mockImplementation(() => {
      return item
    })

    const result = await service.subscribe('my-url', 'email@mail.com')
    expect(result.url).toBe('my-url')
    expect(result.email).toBe('email@mail.com')
    expect(result.createdAt).not.toBeNull()
  });

  it('should not create a new subscription if there is any', async () => {
    item = jest.fn()
    item.save = jest.fn()

    service.getSubscription = jest.fn(() => new Promise((resolve) => resolve(item)))
    model.mockImplementation(() => {
      return item
    })

    const result = await service.subscribe('my-url', 'email@mail.com')
    expect(result).toBeNull()
    expect(item.save.mock.calls.length).toBe(0)
  });

  it('should be able to subscription for all emails', async () => {
    const fakeMethod = service.subscribe = jest.fn()
    const data : SubscriptionDto = {
      url: new URL('https://github.com/owner/repository'),
      emails: ['1@mail.com', '2@mail.com']
    }
    await service.subscribeAll(data)
    expect(fakeMethod.mock.calls.length).toBe(2)
    expect(fakeMethod.mock.calls[0][0]).toBe('https://github.com/owner/repository')
    expect(fakeMethod.mock.calls[1][0]).toBe('https://github.com/owner/repository')
    expect(fakeMethod.mock.calls[0][1]).toBe('1@mail.com')
    expect(fakeMethod.mock.calls[1][1]).toBe('2@mail.com')
  })

  it('should be able get subscriptions by times', async () => {
    const items = [
      {
        url: 'my-url',
        email: '1@mail.com',
        createdAt: new Date
      }
    ]
    const mockFunction = model.aggregate = jest.fn(() => model)
    model.exec = jest.fn(() => new Promise(resolve => resolve(items)))
    const result = await service.getByTimes(20, 21)
    expect(result).toBe(items)
    expect(mockFunction.mock.calls.length).toBe(1)
  })
});
