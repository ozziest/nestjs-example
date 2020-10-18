import { CACHE_MANAGER, HttpService, Inject } from '@nestjs/common';
import { AppLogger } from './../../../logger/app-logger';
import { GitServer } from '../../git-server.interface';

export class GitLabServer implements GitServer {
  repository: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly logger: AppLogger,
    @Inject(CACHE_MANAGER) private readonly cache,
    repository: string,
  ) {
    this.logger.setContext(GitLabServer.name);
    this.repository = repository;
  }

  async getRootFiles(): Promise<string[]> {
    this.logger.debug(`Fetching root files of the "${this.repository}"`);

    const cacheKey = `Cache:GitLabServer@getRootFiles:${this.repository}`;
    let value = (await this.cache.get(cacheKey)) || null;
    if (value) {
      return value;
    }

    const response = await this.httpService
      .get(`https://gitlab.com/${this.repository}/-/refs/master/logs_tree/?format=json&offset=0`)
      .toPromise();
    value = response.data.map(file => file.file_name);
    await this.cache.set(cacheKey, value, { ttl: process.env.CACHE_GITSERVER_TTL });

    return value;
  }

  async getFileContent(filename: string): Promise<string> {
    this.logger.debug(
      `Fetching file content of "${this.repository}/${filename}"`,
    );

    const cacheKey = `Cache:GitLabServer@getFileContent:${this.repository}:${filename}`;
    let value = (await this.cache.get(cacheKey)) || null;
    if (value) {
      return value;
    }

    const response = await this.httpService
      .get(
        `https://gitlab.com/${this.repository}/-/raw/master/${filename}`,
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
