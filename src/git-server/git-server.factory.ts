import { CACHE_MANAGER, HttpService, Inject, Injectable } from '@nestjs/common';
import { AppLogger } from './../logger/app-logger';
import { GitServer } from './git-server.interface';
import { GitHubServer } from './servers/github/github.server';
import { GitLabServer } from './servers/gitlab/gitlab.server';

@Injectable()
export class GitServerFactory {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: AppLogger,
    @Inject(CACHE_MANAGER) private readonly cache,
  ) {}

  resolve(urlString: string): GitServer {
    const url = new URL(urlString);
    const repository: string = this.toPathname(url);

    if (urlString.indexOf('https://github.com') > -1) {
      return new GitHubServer(this.httpService, this.logger, this.cache, repository);
    }

    if (urlString.indexOf('https://gitlab.com') > -1) {
      return new GitLabServer(this.httpService, this.logger, this.cache, repository);
    }

    throw new Error(`The Git Server has not been supported yet: ${url.hostname}`);
  }

  toPathname(url: URL) {
    const pathname = url.pathname.substr(1).trim();
    if (pathname === '') {
      throw new Error(`Unacceptable repository URL: ${url}`);
    }
    return pathname;
  }
}
