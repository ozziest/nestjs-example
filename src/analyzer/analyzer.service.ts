import { Injectable } from '@nestjs/common';
import { Dependency } from './../registry/dependency.interface';
import { GitServerFactory } from './../git-server/git-server.factory';
import { RegistryFactory } from './../registry/registery.factory';
import { AppLogger } from './../logger/app-logger';

@Injectable()
export class AnalyzerService {
  constructor(
    private readonly gitServerFactory: GitServerFactory,
    private readonly registryFactory: RegistryFactory,
    private readonly logger: AppLogger
  ) {}

  async analyze(url: string): Promise<Dependency[]> {
    const result: Dependency[] = [];
    const server = this.gitServerFactory.resolve(url);
    this.logger.debug('Git Server has been detected')

    const registries = this.registryFactory.resolve(
      await server.getRootFiles(),
    );

    this.logger.debug('Registries have been detected')

    for (const registry of registries) {
      registry.resolveRependencies(
        await server.getFileContent(registry.packageFileName)
      );
      result.push(...(await registry.resolveOutdates()));
    }

    this.logger.debug('All packages have been analyzed.')

    return result;
  }
}
