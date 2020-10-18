import { HttpService } from '@nestjs/common';
import { ComposerRegistry } from './composer.registry';
import { ComposerStructure } from './composer.structure';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { AppLogger } from './../../../logger/app-logger';
import { SemanticService } from './../../semantic.service';

describe('ComposerRegistry', () => {
  let registry: ComposerRegistry;
  let httpService: HttpService;
  let cache;

  beforeAll(async () => {
    httpService = new HttpService();
    cache = jest.fn();
    cache.get = jest.fn(() => null);
    cache.set = jest.fn();

    const logger = new AppLogger();
    logger.setContext = jest.fn();
    logger.debug = jest.fn();

    registry = new ComposerRegistry(httpService, new SemanticService(), logger, cache);
  });

  it('should be able convert basic dependency object to Dependency Array', () => {
    const dependencies: Map<string, string> = new Map<string, string>();
    dependencies['my-dependency'] = '^1.0.0';

    const result = registry.toDependencyArray(dependencies);

    expect(result.length).toBe(1);
    expect(result[0].name).toBe('my-dependency');
    expect(result[0].currentVersion).toBe('1.0.0');
    expect(result[0].lastVersion).toBeNull();
    expect(result[0].isOutdated).toBeFalsy();
  });

  it('should be able resolve dependencies', () => {
    const dependencies: Map<string, string> = new Map<string, string>();
    dependencies['my-dependency'] = '^1.0.0';

    const devDependencies: Map<string, string> = new Map<string, string>();
    devDependencies['jest'] = '^1.2.3';
    devDependencies['php'] = '^5.7';

    const content: ComposerStructure = {
      name: 'my-packages',
      require: dependencies,
      "require-dev": devDependencies
    };

    registry.resolveRependencies(content);

    expect(registry.dependencies.length).toBe(3);
    expect(registry.dependencies[0].name).toBe('my-dependency');
    expect(registry.dependencies[0].currentVersion).toBe('1.0.0');
    expect(registry.dependencies[0].lastVersion).toBeNull();
    expect(registry.dependencies[0].isOutdated).toBeFalsy();

    expect(registry.dependencies[1].name).toBe('jest');
  });

  it('should be able get get outdated dependency list', async () => {
    const axiosResult: AxiosResponse = {
      data: {
        packages: {
          "jest": {
            "3.2.1": {},
            "dev-master": {}
          },
          "my-dependency": {
            "1.5.6": {}
          }
        },
        total: 1,
        from: 0,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    const httpServiceListener = jest
      .spyOn(httpService, 'get')
      .mockImplementation(() => of(axiosResult));

    const result = await registry.resolveOutdates();

    expect(httpServiceListener.mock.calls.length).toBe(2);
    expect(httpServiceListener.mock.calls[0][0]).toBe(
      'https://repo.packagist.org/p/my-dependency.json'
    );
    expect(httpServiceListener.mock.calls[1][0]).toBe(
      'https://repo.packagist.org/p/jest.json'
    );

    expect(result.length).toBe(2);
    expect(result[0].name).toBe('my-dependency');
    expect(result[0].lastVersion).toBe('1.5.6');
    expect(result[0].isOutdated).toBeTruthy();
  });
});
