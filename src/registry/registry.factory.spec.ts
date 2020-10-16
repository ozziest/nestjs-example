import { HttpService } from '@nestjs/common';
import { RegistryFactory } from './registery.factory';
import { RegistryTypes } from './registry.types';

describe('RegistryFactory', () => {
  let factory: RegistryFactory;

  beforeAll(async () => {
    const MockHttpService = jest.fn<HttpService, any>()
    factory = new RegistryFactory(new MockHttpService())
  });

  it('should be able to resolve registry types correctly', () => {
    const result = factory.getRegistryTypes(['package.json', 'readme.md'])
    expect(result.length).toBe(1)
    expect(result[0]).toBe(RegistryTypes.JavaScript)
  });

  it('should be able create registries by file names', () => {
    const result = factory.resolve(['package.json', 'readme.md'])
    expect(result.length).toBe(1)
    expect(result[0].packageFileName).toBe('package.json')
    expect(result[0].constructor.name).toBe('NpmRegistry')
  });

  it('should be able throw for undefined registries', () => {
    expect(() => factory.resolve(['package.json', 'composer.json'])).toThrow('Undefined Registry: PHP')
  });
});
