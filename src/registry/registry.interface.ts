import { Dependency } from './dependency.interface';

export interface Registry {
  resolveOutdates(): Promise<Dependency[]>;
  resolveRependencies(content: any);
  packageFileName: string;
  dependencies: Dependency[];
}
