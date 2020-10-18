import { Dependency } from "src/registry/dependency.interface";
import { HtmlBuilderService } from "./html-builder.service";

describe('HtmlBuilderService', () => {
  let builder: HtmlBuilderService;

  beforeEach(async () => {
    builder = new HtmlBuilderService()
  });

  it('should be able to create dependency report HTML as correctly', async () => {
    const items : Dependency[] = [
      {
        name: 'my-repo',
        currentVersion: '1.0.0',
        lastVersion: '1.0.1',
        isOutdated: true
      }
    ]
    const result = builder.buildReport(items)
    expect(result).toContain('<h1>Daily Dependency Report</h1>')
    expect(result).toContain('<b>my-repo</b> is outdated')
    expect(result).toContain('Current: 1.0.0')
    expect(result).toContain('Latest: 1.0.1')
  });

  it('should be able to create empty dependency report', async () => {
    const result = builder.buildReport([])
    expect(result).toContain('There is not any outdated repository')
  });  
});
