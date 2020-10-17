import { HttpService } from '@nestjs/common';
import { GitHubServer } from './../git-server/servers/github.server';
import { GitServerFactory } from './../git-server/git-server.factory';
import { RegistryFactory } from './../registry/registery.factory';
import { TrackerService } from './tracker.service';
import { NpmRegistry } from './../registry/registries/npm.registry';
import { Dependency } from './../registry/dependency.interface';
import { RedisService } from './../redis/redis.service';
import { Tedis } from "tedis";
import { AppLogger } from './../logger/app-logger';

describe('TrackerService', () => {
  let service: TrackerService;
  let gitServerFactory: GitServerFactory;
  let registryFactory: RegistryFactory;
  let redisService: RedisService;
  let tedis : Tedis;
  let logger : AppLogger;
  let cache;

  beforeEach(async () => {
    logger = new AppLogger()
    logger.setContext = jest.fn()
    logger.log = jest.fn()
    cache = jest.fn()

    gitServerFactory = new GitServerFactory(new HttpService(), logger, cache)
    registryFactory = new RegistryFactory(new HttpService(), logger, cache)
    redisService = new RedisService()
    const Mock = jest.fn<Tedis, any>()
    tedis = new Mock()
    tedis.keys = jest.fn(() => new Promise(resolve => resolve([])))
    redisService.getClient = jest.fn(() => tedis)
    service = new TrackerService(gitServerFactory, registryFactory, redisService)
  });

  it('should be able to analyze the repository dependencies"', async () => {
    const github = new GitHubServer(new HttpService(), logger, cache, '')
    github.getRootFiles = jest.fn(() => new Promise(resolve => resolve(['package.json'])))
    github.getFileContent = jest.fn(() => new Promise(resolve => resolve('my-file-content')))

    const registries = [
      new NpmRegistry(new HttpService(), logger, cache)
    ]

    const dependency : Dependency = {
      name: 'jest',
      currentVersion: '1.2.3',
      lastVersion: '3.2.1',
      isOutdated: true
    }

    registries[0].resolveRependencies = jest.fn()
    registries[0].resolveOutdates = jest.fn(() => new Promise(resolve => resolve([dependency])))

    gitServerFactory.resolve = jest.fn(() => github)
    registryFactory.resolve = jest.fn(() => registries)

    const result = await service.analyze('https://github.com/owner/repository')
    expect(result.length).toBe(1)
    expect(result[0]).toBe(dependency)
  });

  it ('should be able to load data from Redis', async () => {
    const fakeValue = {
      url: 'https://github.com/adonisx/adonisx',
      email: 'i.ozguradem@gmail.com',
      createdAt: '2020-10-16T23:40:23.381Z'
    }
    
    tedis.keys = jest.fn(() => new Promise(resolve => resolve(['SUBSCRIPTION:hash1'])))
    tedis.get = jest.fn(() => new Promise(resolve => resolve(JSON.stringify(fakeValue))))
    redisService.getClient = jest.fn(() => tedis)
    service = new TrackerService(gitServerFactory, registryFactory, redisService)

    await new Promise((r) => setTimeout(r, 100))
    const result = service.getRepositories()
    expect(result.length).toBe(1)
    expect(result[0].url).toBe('https://github.com/adonisx/adonisx')
    expect(result[0].subscriptions.length).toBe(1)
    expect(result[0].subscriptions[0].email).toBe('i.ozguradem@gmail.com')
  })

  it ('should be able create new subscription via Redis', async () => {
    let key, value = null
    tedis.keys = jest.fn(() => new Promise(resolve => resolve([])))
    tedis.set = jest.fn((k, v) => {
      return new Promise((resolve) => {
        key = k
        value = v
        resolve()
      })
    })
    redisService.getClient = jest.fn(() => tedis)
    service = new TrackerService(gitServerFactory, registryFactory, redisService)
    service.createSubscription('https://github.com/adonisx/adonisx', ['i.ozguradem@gmail.com'])

    await new Promise((r) => setTimeout(r, 100))    

    const result = service.getRepositories()
    expect(result.length).toBe(1)
    expect(result[0].url).toBe('https://github.com/adonisx/adonisx')
    expect(result[0].subscriptions.length).toBe(1)
    expect(result[0].subscriptions[0].email).toBe('i.ozguradem@gmail.com')

    expect(key.indexOf('SUBSCRIPTION:')).toBe(0)
    expect(JSON.parse(value).url).toBe('https://github.com/adonisx/adonisx')
    expect(JSON.parse(value).email).toBe('i.ozguradem@gmail.com')
  })
});
