export interface Dependency {
  name: string,
  currentVersion: string
  lastVersion: string|null,
  isOutdated: boolean
}