import { BadRequestException, CACHE_MANAGER, HttpService, Inject, Injectable } from '@nestjs/common';
import { AppLogger } from './../logger/app-logger';
import { GitServer } from './git-server.interface';
import { GitHubServer } from './servers/github/github.server';
import { GitLabServer } from './servers/gitlab/gitlab.server';

@Injectable()
export class GitServerFactory {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cache,
  ) {}

  resolve(urlString: string): GitServer {
    const url = new URL(urlString);
    const repository: string = this.toPathname(url);

    if (url.hostname === 'github.com') {
      return new GitHubServer(this.httpService, new AppLogger(), this.cache, repository);
    }

    if (url.hostname === 'gitlab.com') {
      return new GitLabServer(this.httpService, new AppLogger(), this.cache, repository);
    }

    throw new BadRequestException(`The Git Server has not been supported yet: ${url.hostname}`);
  }

  toPathname(url: URL) {
    const pathname = url.pathname.substr(1).trim();
    if (pathname === '') {
      throw new BadRequestException(`Unacceptable repository URL: ${url}`);
    }
    return pathname;
  }
}
