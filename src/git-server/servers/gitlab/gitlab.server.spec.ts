import { HttpService } from '@nestjs/common';
import { of } from 'rxjs';
import { GitLabServer } from './gitlab.server';
import { AxiosResponse } from 'axios';
import { AppLogger } from './../../../logger/app-logger';

describe('GitLabServer', () => {
  let server: GitLabServer;
  let httpService: HttpService;
  let cache;

  beforeEach(async () => {
    httpService = new HttpService();
    cache = jest.fn();
    cache.get = jest.fn(() => null);
    cache.set = jest.fn();

    const logger = new AppLogger();
    logger.debug = jest.fn();

    server = new GitLabServer(httpService, logger, cache, 'owner/repository');
  });

  it('should be able set the repository name correctly"', () => {
    expect(server.repository).toBe('owner/repository');
  });

  it('should be able get root files"', async () => {
    const axiosResult: AxiosResponse = {
      data: [
        { file_name: 'package.json' },
        { file_name: 'composer.json' },
        { file_name: 'readme.md' },
      ],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    const httpServiceListener = jest
      .spyOn(httpService, 'get')
      .mockImplementation(() => of(axiosResult));

    const result = await server.getRootFiles();

    expect(httpServiceListener.mock.calls.length).toBe(1);
    expect(httpServiceListener.mock.calls[0][0]).toBe(
      'https://gitlab.com/owner/repository/-/refs/master/logs_tree/?format=json&offset=0'
    );

    expect(result.length).toBe(3);
    expect(result[0]).toBe(axiosResult.data[0].file_name);
    expect(result[1]).toBe(axiosResult.data[1].file_name);
    expect(result[2]).toBe(axiosResult.data[2].file_name);
  });

  it('should be able get the file content"', async () => {
    const axiosResult: AxiosResponse = {
      data: {
        name: 'my-repository',
        dependencies: {
          'owner/repository': '^5.0.8',
        },
        devDependencies: {
          jest: '^25.2.7',
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    const httpServiceListener = jest
      .spyOn(httpService, 'get')
      .mockImplementation(() => of(axiosResult));

    const result = await server.getFileContent('package.json');
    expect(result).toBe(axiosResult.data);

    expect(httpServiceListener.mock.calls.length).toBe(1);
    expect(httpServiceListener.mock.calls[0][0]).toBe(
      'https://gitlab.com/owner/repository/-/raw/master/package.json'
    );
  });
});
