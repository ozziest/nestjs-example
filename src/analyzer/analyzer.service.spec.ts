import { HttpService } from '@nestjs/common';
import { GitHubServer } from './../git-server/servers/github/github.server';
import { GitServerFactory } from './../git-server/git-server.factory';
import { RegistryFactory } from './../registry/registery.factory';
import { AnalyzerService } from './analyzer.service';
import { NpmRegistry } from './../registry/registries/npm/npm.registry';
import { Dependency } from './../registry/dependency.interface';
import { SemanticService } from './../registry/semantic.service';

describe('AnalyzerService', () => {
  let service: AnalyzerService;
  let gitServerFactory: GitServerFactory;
  let registryFactory: RegistryFactory;
  let logger;
  let cache;

  beforeEach(async () => {
    logger = jest.fn()
    logger.setContext = jest.fn();
    logger.log = jest.fn();
    logger.debug = jest.fn();
    cache = jest.fn();

    gitServerFactory = new GitServerFactory(new HttpService(), cache);
    registryFactory = new RegistryFactory(new HttpService(), logger, cache);
    service = new AnalyzerService(gitServerFactory, registryFactory, logger);
  });

  it('should be able to analyze the repository dependencies"', async () => {
    const github = new GitHubServer(new HttpService(), logger, cache, '');
    github.getRootFiles = jest.fn(
      () => new Promise(resolve => resolve(['package.json'])),
    );
    github.getFileContent = jest.fn(
      () => new Promise(resolve => resolve('my-file-content')),
    );

    const registries = [new NpmRegistry(new HttpService(), new SemanticService(), logger, cache)];

    const dependency: Dependency = {
      name: 'jest',
      currentVersion: '1.2.3',
      lastVersion: '3.2.1',
      isOutdated: true,
    };

    registries[0].resolveRependencies = jest.fn();
    registries[0].resolveOutdates = jest.fn(
      () => new Promise(resolve => resolve([dependency])),
    );

    gitServerFactory.resolve = jest.fn(() => github);
    registryFactory.resolve = jest.fn(() => registries);

    const result = await service.analyze('https://github.com/owner/repository');
    expect(result.length).toBe(1);
    expect(result[0]).toBe(dependency);
  });
});
