import { Injectable } from '@nestjs/common';
import { coerce } from 'semver'

@Injectable()
export class SemanticService {
  isOutdated(currentVersion: string, versions: string[]): boolean {
    const current = coerce(currentVersion)
    if (current === null) {
      throw new Error(`Invalid version number: ${currentVersion}`)
    }

    currentVersion = current.version
    return currentVersion !== this.getLastVersion(currentVersion, versions)
  }

  getLastVersion(currentVersion: string, versions: string[]): string {
    const current = coerce(currentVersion)
    if (current === null) {
      throw new Error(`Invalid version number: ${currentVersion}`)
    }

    let lastVersion = current
    for (const version of versions) {
      try {
        const newVersion = coerce(version)
        if (newVersion && current.compare(newVersion) < 0) {
          lastVersion = newVersion
        }
      } catch (err) {
        // We don't need to do anything
      }
    }

    return lastVersion.version
  }  
}
