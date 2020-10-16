import { HttpService } from "@nestjs/common";
import { Dependency } from "../dependency.interface";
import { Registry } from "../registry.interface";
import { NpmStructure } from "./npm.structure";

export class NpmRegistry implements Registry {
  packageFileName: string;
  name: string;
  dependencies: Dependency[];

  constructor (private httpService: HttpService) {
    this.packageFileName = 'package.json'
  }

  resolveRependencies(content: NpmStructure) {
    this.dependencies = []

    if (content.dependencies) {
      this.dependencies.push(...this.toDependencyArray(content.dependencies))
    }

    if (content.devDependencies) {
      this.dependencies.push(...this.toDependencyArray(content.devDependencies))
    }
  }

  toDependencyArray (dependencies: Map<string, string>) {
    const result: Dependency[] = []

    for (const name in dependencies) {
      result.push({
        name,
        currentVersion: dependencies[name].replace('^', ''),
        lastVersion: null,
        isOutdated: false
      })
    }

    return result
  }

  async resolveOutdates(): Promise<Dependency[]> {
    for (const dependency of this.dependencies) {
      dependency.lastVersion = await this.getLastVersion(dependency)
      if (dependency.lastVersion && dependency.currentVersion !== dependency.lastVersion) {
        dependency.isOutdated = true
      }
    }

    return this.dependencies.filter(dependency => dependency.isOutdated)
  }

  async getLastVersion (dependency: Dependency): Promise<string|null> {
    const response = await this.httpService
      .get(`http://npmsearch.com/query?q=name:"${dependency.name}"`)
      .toPromise()
    const item = response.data.results.find(item => item.name.indexOf(dependency.name) > -1)

    if (item && item.version && item.version.length > 0) {
      return item.version[0]
    }

    return null
  }
}