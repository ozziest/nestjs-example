import { HttpService, Injectable } from '@nestjs/common';
import { NpmRegistry } from './registries/npm.registry';
import { Registry } from './registry.interface';
import { RegistryTypes } from './registry.types';

@Injectable()
export class RegistryFactory {
  constructor (private httpService: HttpService) {}
  
  resolve(files: string[]): Registry[] {
    const registryTypes = this.getRegistryTypes(files)
    const registries : Registry[] = []

    for (const projectType of registryTypes) {
      switch(projectType) {
        case RegistryTypes.JavaScript:
          registries.push(new NpmRegistry(this.httpService))
          break;
        default:
          throw new Error(`Undefined Registry: ${projectType.toString()}`);
      }
    }

    return registries
  }

  getRegistryTypes (files: string []): RegistryTypes[] {
    const registryTypes : RegistryTypes[] = []

    if (files.some(file => file === 'package.json')) {
      registryTypes.push(RegistryTypes.JavaScript)
    }

    if (files.some(file => file === 'composer.json')) {
      registryTypes.push(RegistryTypes.PHP)
    }

    return registryTypes
  }
}