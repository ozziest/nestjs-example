import { HttpService } from '@nestjs/common';
import { GitHubServer } from './../git-server/servers/github.server';
import { GitServerFactory } from './../git-server/git-server.factory';
import { RegistryFactory } from './../registry/registery.factory';
import { TrackerService } from './tracker.service';
import { NpmRegistry } from './../registry/registries/npm.registry';
import { Dependency } from './../registry/dependency.interface';
import { RedisService } from './../redis/redis.service';

describe('TrackerService', () => {
  let service: TrackerService;
  let gitServerFactory: GitServerFactory;
  let registryFactory: RegistryFactory;
  let redisService: RedisService;

  beforeAll(async () => {
    gitServerFactory = new GitServerFactory(new HttpService())
    registryFactory = new RegistryFactory(new HttpService())
    redisService = new RedisService()
    service = new TrackerService(gitServerFactory, registryFactory, redisService)
  });

  it('should be able to resolve the repository name"', async () => {
    const github = new GitHubServer(new HttpService(), '')
    github.getRootFiles = jest.fn(() => new Promise(resolve => resolve(['package.json'])))
    github.getFileContent = jest.fn(() => new Promise(resolve => resolve('my-file-content')))

    const registries = [
      new NpmRegistry(new HttpService())
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
});
