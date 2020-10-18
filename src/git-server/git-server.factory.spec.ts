import { HttpService } from '@nestjs/common';
import { GitServerFactory } from './git-server.factory';

describe('GitServerFactory', () => {
  let factory: GitServerFactory;

  beforeAll(async () => {
    const MockHttpService = jest.fn<HttpService, any>();

    const cache = jest.fn();
    factory = new GitServerFactory(new MockHttpService(), cache);
  });

  it('should be able to resolve the repository name"', () => {
    expect(
      factory.toPathname(new URL('https://github.com/owner/repository')),
    ).toBe('owner/repository');
    expect(() => factory.toPathname(new URL('https://github.com'))).toThrow(
      'Unacceptable repository URL: https://github.com',
    );
  });

  it('should be able to throw an exception for unknown git servers', () => {
    expect(() =>
      factory.resolve('https://unknown.com/owner/repository'),
    ).toThrow('The Git Server has not been supported yet: unknown.com');
  });

  it('should be able to resolve the GitHub server', () => {
    expect(() =>
      factory.resolve('https://github.com/owner/repository'),
    ).not.toThrow();
    const server = factory.resolve('https://github.com/owner/repository');
    expect(server.repository).toBe('owner/repository');
  });
});
