import { Injectable } from '@nestjs/common';
import { GitServerFactory } from './../git-server/git-server.factory';
import { GitServer } from './../git-server/git-server.interface';
import { Dependency } from './../registry/dependency.interface';
import { RegistryFactory } from './../registry/registery.factory';
import { Registry } from './../registry/registry.interface';
import { TaskLogger } from './task-logger';

@Injectable()
export class TrackerService {
  server: GitServer;
  registries: Registry[];

  constructor (
    private readonly gitServerFactory: GitServerFactory,
    private readonly registryFactory: RegistryFactory,
    private readonly logger: TaskLogger
  ) {}

  async analyze(url: string): Promise<Dependency[]> {
    const result : Dependency[] = []
    this.logger.debug('Resolving the GitServer')
    this.server = this.gitServerFactory.resolve(url)

    this.logger.debug('Resolving required registries.')
    this.registries = this.registryFactory.resolve(await this.server.getRootFiles())

    for (const registry of this.registries) {
      this.logger.debug(`Fetching file content: ${registry.packageFileName}`)
      const content = await this.server.getFileContent(registry.packageFileName)

      this.logger.debug('Resolving dependencies')
      registry.resolveRependencies(content)

      this.logger.debug('Resolving outdated packages.')
      result.push(...await registry.resolveOutdates())
    }

    this.logger.log('Completed!')
    return result
  }
}