import { CACHE_MANAGER, HttpService, Inject } from '@nestjs/common';
import { AppLogger } from './../../logger/app-logger';
import { Dependency } from '../dependency.interface';
import { Registry } from '../registry.interface';
import { NpmStructure } from './npm.structure';

export class NpmRegistry implements Registry {
  packageFileName: string;
  name: string;
  dependencies: Dependency[];

  constructor(
    private readonly httpService: HttpService,
    private readonly logger: AppLogger,
    @Inject(CACHE_MANAGER) private readonly cache,
  ) {
    this.logger.setContext(NpmRegistry.name);
    this.packageFileName = 'package.json';
  }

  resolveRependencies(content: NpmStructure) {
    this.dependencies = [];

    if (content.dependencies) {
      this.dependencies.push(...this.toDependencyArray(content.dependencies));
    }

    if (content.devDependencies) {
      this.dependencies.push(
        ...this.toDependencyArray(content.devDependencies),
      );
    }
  }

  toDependencyArray(dependencies: Map<string, string>) {
    const result: Dependency[] = [];

    for (const name in dependencies) {
      result.push({
        name,
        currentVersion: dependencies[name].replace('^', ''),
        lastVersion: null,
        isOutdated: false,
      });
    }

    return result;
  }

  async resolveOutdates(): Promise<Dependency[]> {
    for (const dependency of this.dependencies) {
      dependency.lastVersion = await this.getLastVersion(dependency);
      if (
        dependency.lastVersion &&
        dependency.currentVersion !== dependency.lastVersion
      ) {
        dependency.isOutdated = true;
      }
    }

    return this.dependencies.filter(dependency => dependency.isOutdated);
  }

  async getLastVersion(dependency: Dependency): Promise<string | null> {
    this.logger.debug(`Fetching the last version of "${dependency.name}"`);

    const cacheKey = `Cache:NpmRegister@getLastVersion:${dependency.name}`;
    let value = (await this.cache.get(cacheKey)) || null;
    if (value) {
      return value;
    }

    const response = await this.httpService
      .get(`http://npmsearch.com/query?q=name:"${dependency.name}"`)
      .toPromise();

    value = null;
    const item = response.data.results.find(
      item => item.name.indexOf(dependency.name) > -1,
    );

    if (item && item.version && item.version.length > 0) {
      value = item.version[0];
    }

    await this.cache.set(cacheKey, value, { ttl: 6000 });

    return value;
  }
}
