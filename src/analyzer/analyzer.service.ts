import { Injectable } from '@nestjs/common';
import { Dependency } from './../registry/dependency.interface';
import { GitServerFactory } from './../git-server/git-server.factory';
import { RegistryFactory } from './../registry/registery.factory';

@Injectable()
export class AnalyzerService {
  constructor(
    private readonly gitServerFactory: GitServerFactory,
    private readonly registryFactory: RegistryFactory,
  ) {}

  async analyze(url: string): Promise<Dependency[]> {
    const result: Dependency[] = [];
    const server = this.gitServerFactory.resolve(url);

    const registries = this.registryFactory.resolve(
      await server.getRootFiles(),
    );

    for (const registry of registries) {
      registry.resolveRependencies(
        await server.getFileContent(registry.packageFileName)
      );
      result.push(...(await registry.resolveOutdates()));
    }

    return result;
  }
}
