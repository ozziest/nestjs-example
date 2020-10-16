export interface NpmStructure {
  name: string,
  dependencies: Map<string, string>,
  devDependencies: Map<string, string>
}