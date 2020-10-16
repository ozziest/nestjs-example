import { HttpService } from '@nestjs/common';
import { of } from 'rxjs';
import { GitHubServer } from './github.server';
import { AxiosResponse } from 'axios';

describe('GitHubServer', () => {
  let server: GitHubServer;
  let httpService: HttpService;

  beforeEach(async () => {
    httpService = new HttpService()
    server = new GitHubServer(httpService, 'owner/repository')
  });

  it('should be able set the repository name correctly"', () => {
    expect(server.repository).toBe('owner/repository')
  });

  it('should be able get root files"', async () => {
    const axiosResult: AxiosResponse = {
      data: [
        { name: 'package.json' },
        { name: 'composer.json' },
        { name: 'readme.md' },
      ],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    const httpServiceListener = jest
      .spyOn(httpService, 'get')
      .mockImplementation(() => of (axiosResult))

    const result = await server.getRootFiles()

    expect(httpServiceListener.mock.calls.length).toBe(1)
    expect(httpServiceListener.mock.calls[0][0]).toBe('https://api.github.com/repos/owner/repository/contents')

    expect(result.length).toBe(3)
    expect(result[0]).toBe(axiosResult.data[0].name)
    expect(result[1]).toBe(axiosResult.data[1].name)
    expect(result[2]).toBe(axiosResult.data[2].name)
  });

  it('should be able get the file content"', async () => {
    const axiosResult: AxiosResponse = {
      data: {
        name: "my-repository",
        dependencies: {
          "@adonisjs/ace": "^5.0.8",
        },
        devDependencies: {
          jest: "^25.2.7"
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    const httpServiceListener = jest
      .spyOn(httpService, 'get')
      .mockImplementation(() => of (axiosResult))

    const result = await server.getFileContent('package.json')
    expect(result).toBe(axiosResult.data)

    expect(httpServiceListener.mock.calls.length).toBe(1)
    expect(httpServiceListener.mock.calls[0][0]).toBe('https://raw.githubusercontent.com/owner/repository/master/package.json')
  });
});
