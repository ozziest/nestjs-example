import { BadRequestException, CACHE_MANAGER, HttpService, Inject, Injectable } from '@nestjs/common';
import { AppLogger } from './../logger/app-logger';
import { ComposerRegistry } from './registries/composer/composer.registry';
import { NpmRegistry } from './registries/npm/npm.registry';
import { Registry } from './registry.interface';
import { RegistryTypes } from './registry.types';

@Injectable()
export class RegistryFactory {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cache,
  ) {}

  resolve(files: string[]): Registry[] {
    const registryTypes = this.getRegistryTypes(files);
    const registries: Registry[] = [];

    if (registryTypes.length === 0) {
      throw new BadRequestException('There is not any supported package manager (NPM, Composer) in the repository.')
    }

    for (const projectType of registryTypes) {
      switch (projectType) {
        case RegistryTypes.JavaScript:
          registries.push(
            new NpmRegistry(this.httpService, new AppLogger(), this.cache),
          );
          break;
        case RegistryTypes.PHP:
          registries.push(
            new ComposerRegistry(this.httpService, new AppLogger(), this.cache),
          );
          break;
      }
    }

    return registries;
  }

  getRegistryTypes(files: string[]): RegistryTypes[] {
    const registryTypes: RegistryTypes[] = [];

    if (files.some(file => file === 'package.json')) {
      registryTypes.push(RegistryTypes.JavaScript);
    }

    if (files.some(file => file === 'composer.json')) {
      registryTypes.push(RegistryTypes.PHP);
    }

    return registryTypes;
  }
}
