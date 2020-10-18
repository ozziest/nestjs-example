import { CACHE_MANAGER, HttpService, Inject } from '@nestjs/common';
import { AppLogger } from './../../../logger/app-logger';
import { Dependency } from '../../dependency.interface';
import { Registry } from '../../registry.interface';
import { ComposerStructure } from './composer.structure';
import { SemVer } from 'semver'

export class ComposerRegistry implements Registry {
  packageFileName: string;
  dependencies: Dependency[];

  constructor(
    private readonly httpService: HttpService,
    private readonly logger: AppLogger,
    @Inject(CACHE_MANAGER) private readonly cache,
  ) {
    this.logger.setContext(ComposerRegistry.name);
    this.packageFileName = 'composer.json';
  }

  resolveRependencies(content: ComposerStructure) {
    this.dependencies = [];

    if (content.require) {
      this.dependencies.push(...this.toDependencyArray(content.require));
    }

    if (content["require-dev"]) {
      this.dependencies.push(
        ...this.toDependencyArray(content["require-dev"]),
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

    if (dependency.name === "php") {
      return dependency.currentVersion
    }

    const cacheKey = `Cache:NpmRegister@getLastVersion:${dependency.name}`;
    let value = (await this.cache.get(cacheKey)) || null;
    if (value) {
      return value;
    }

    const response = await this.httpService
      .get(`https://repo.packagist.org/p/${dependency.name}.json`)
      .toPromise();

    value = null;
    const item = response.data.packages[dependency.name]

    for (const version of Object.keys(item)) {
      try {
        value = (new SemVer(version)).toString()
      } catch (err) {
        // We don't need to do anything
      }
    }

    await this.cache.set(cacheKey, value, { ttl: process.env.CACHE_REGISTRY_TTL });

    return value;
  }
}
