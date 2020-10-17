export interface GitServer {
  getFileContent(filename: string): Promise<string>;
  getRootFiles(): Promise<string[]>;
  repository: string;
}
