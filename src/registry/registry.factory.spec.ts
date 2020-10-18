import { HttpService } from '@nestjs/common';
import { AppLogger } from './../logger/app-logger';
import { RegistryFactory } from './registery.factory';
import { RegistryTypes } from './registry.types';

describe('RegistryFactory', () => {
  let factory: RegistryFactory;

  beforeAll(async () => {
    const MockHttpService = jest.fn<HttpService, any>();
    const logger = new AppLogger();
    logger.setContext = jest.fn();
    logger.debug = jest.fn();

    const cache = jest.fn();
    factory = new RegistryFactory(new MockHttpService(), logger, cache);
  });

  it('should be able to resolve registry types correctly', () => {
    const result = factory.getRegistryTypes(['package.json', 'readme.md']);
    expect(result.length).toBe(1);
    expect(result[0]).toBe(RegistryTypes.JavaScript);
  });

  it('should be able create registries by file names', () => {
    const result = factory.resolve(['package.json', 'readme.md']);
    expect(result.length).toBe(1);
    expect(result[0].packageFileName).toBe('package.json');
    expect(result[0].constructor.name).toBe('NpmRegistry');
  });

  it('should be able throw for undefined registries', () => {
    expect(() => factory.resolve([])).toThrow(
      'There is not any supported package manager (NPM, Composer) in the repository.'
    );
  });
});
