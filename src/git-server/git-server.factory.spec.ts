import { HttpService } from '@nestjs/common';
import { GitServerFactory } from './git-server.factory';

describe('GitServerFactory', () => {
  let factory: GitServerFactory;

  beforeAll(async () => {
    const MockHttpService = jest.fn<HttpService, any>()
    factory = new GitServerFactory(new MockHttpService())
  });

  it('should be able to resolve the repository name"', () => {
    expect(factory.toPathname(new URL('https://github.com/adonisx/adonisx')))
      .toBe('adonisx/adonisx');
    expect(() => factory.toPathname(new URL('https://github.com')))
      .toThrow('Unacceptable repository URL: https://github.com')
  });

  it('should be able to throw an exception for unknown git servers', () => {
    expect(() => factory.resolve('https://unknown.com/adonisx/adonisx')).toThrow('Undefined Git Server: unknown.com')
  });

  it('should be able to resolve the GitHub server', () => {
    expect(() => factory.resolve('https://github.com/adonisx/adonisx')).not.toThrow()
    const server = factory.resolve('https://github.com/adonisx/adonisx')
    expect(server.repository).toBe('adonisx/adonisx')
  });
});
