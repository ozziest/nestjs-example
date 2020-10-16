import { HttpService } from '@nestjs/common';
import { NpmRegistry } from './npm.registry';
import { NpmStructure } from './npm.structure';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

describe('NpmRegistry', () => {
  let registry: NpmRegistry;
  let httpService: HttpService;

  beforeAll(async () => {
    httpService = new HttpService()
    registry = new NpmRegistry(httpService)
  });

  it('should be able convert basic dependency object to Dependency Array', () => {
    const dependencies : Map<string, string> = new Map<string, string>()
    dependencies["my-dependency"] = "^1.0.0"

    const result = registry.toDependencyArray(dependencies)

    expect(result.length).toBe(1)
    expect(result[0].name).toBe("my-dependency")
    expect(result[0].currentVersion).toBe("1.0.0")
    expect(result[0].lastVersion).toBeNull()
    expect(result[0].isOutdated).toBeFalsy()
  });

  it('should be able resolve dependencies', () => {
    const dependencies : Map<string, string> = new Map<string, string>()
    dependencies["my-dependency"] = "^1.0.0"

    const devDependencies : Map<string, string> = new Map<string, string>()
    devDependencies["jest"] = "^1.2.3"

    const content : NpmStructure = {
      name: "my-packages",
      dependencies,
      devDependencies
    }

    registry.resolveRependencies(content)

    expect(registry.dependencies.length).toBe(2)
    expect(registry.dependencies[0].name).toBe("my-dependency")
    expect(registry.dependencies[0].currentVersion).toBe("1.0.0")
    expect(registry.dependencies[0].lastVersion).toBeNull()
    expect(registry.dependencies[0].isOutdated).toBeFalsy()

    expect(registry.dependencies[1].name).toBe("jest")
  });

  it('should be able get get outdated dependency list', async () => {
    const axiosResult: AxiosResponse = {
      data: {
        results: [
          {
            name: [
              "jest"
            ],
            version: [
              "3.2.1"
            ]
          }
        ],
        total: 1,
        from: 0
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    const httpServiceListener = jest
      .spyOn(httpService, 'get')
      .mockImplementation(() => of (axiosResult))

    const result = await registry.resolveOutdates()

    expect(httpServiceListener.mock.calls.length).toBe(2)
    expect(httpServiceListener.mock.calls[0][0]).toBe('http://npmsearch.com/query?q=name:"my-dependency"')
    expect(httpServiceListener.mock.calls[1][0]).toBe('http://npmsearch.com/query?q=name:"jest"')

    expect(result.length).toBe(1)
    expect(result[0].name).toBe('jest')
    expect(result[0].lastVersion).toBe('3.2.1')
    expect(result[0].isOutdated).toBeTruthy()
  })
});
