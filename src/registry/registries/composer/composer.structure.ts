export interface ComposerStructure {
  name: string;
  require: Map<string, string>;
  "require-dev": Map<string, string>;
}
