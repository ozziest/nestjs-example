import { HttpService } from "@nestjs/common";
import { GitServer } from "../git-server.interface";

export class GitHubServer implements GitServer {
  repository: string;

  constructor(
    private httpService: HttpService,
    repository: string
  ) {
    this.repository = repository
  }

  async getRootFiles (): Promise<string[]> {
    const response = await this.httpService
      .get(`https://api.github.com/repos/${this.repository}/contents`)
      .toPromise()
    return response.data.map(file => file.name)
  }

  async getFileContent(filename: string): Promise<string> {
    const response = await this
      .httpService
      .get(
        `https://raw.githubusercontent.com/${this.repository}/master/${filename}`,
        {
          headers: {
            'Accept': 'text/plain',
          },
        })
      .toPromise()
    return response.data
  }
}