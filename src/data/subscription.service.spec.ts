import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Subscription } from './schemas/subscription.schema';
import { SubscriptionsService } from './subscription.service';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let model;
  let item;

  beforeEach(async () => {
    model = jest.fn()

    const module = await Test.createTestingModule({
        providers: [
          SubscriptionsService,
          {
            provide: getModelToken(Subscription.name),
            useValue: model,
          },
        ],
      }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('should be able to get if ther is any subscription', async () => {
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
});
