import { CACHE_MANAGER, HttpService, Inject } from '@nestjs/common';
import { AppLogger } from './../../logger/app-logger';
import { GitServer } from '../git-server.interface';

export class GitHubServer implements GitServer {
  repository: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly logger: AppLogger,
    @Inject(CACHE_MANAGER) private readonly cache,
    repository: string,
  ) {
    this.logger.setContext(GitHubServer.name);
    this.repository = repository;
  }

  async getRootFiles(): Promise<string[]> {
    this.logger.debug(`Fetching root files of the "${this.repository}"`);

    const cacheKey = `Cache:GitHubServer@getRootFiles:${this.repository}`;
    let value = (await this.cache.get(cacheKey)) || null;
    if (value) {
      return value;
    }

    const response = await this.httpService
      .get(`https://api.github.com/repos/${this.repository}/contents`)
      .toPromise();
    value = response.data.map(file => file.name);
    await this.cache.set(cacheKey, value, { ttl: process.env.CACHE_GITSERVER_TTL });

    return value;
  }

  async getFileContent(filename: string): Promise<string> {
    this.logger.debug(
      `Fetching file content of "${this.repository}/${filename}"`,
    );

    const cacheKey = `Cache:GitHubServer@getFileContent:${this.repository}:${filename}`;
    let value = (await this.cache.get(cacheKey)) || null;
    if (value) {
      return value;
    }

    const response = await this.httpService
      .get(
        `https://raw.githubusercontent.com/${this.repository}/master/${filename}`,
        {
          headers: {
            Accept: 'text/plain',
          },
        },
      )
      .toPromise();
    value = response.data;

    await this.cache.set(cacheKey, value, { ttl: process.env.CACHE_GITSERVER_TTL });

    return value;
  }
}
