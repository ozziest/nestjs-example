import { SemanticService } from './semantic.service';

describe('RegistryFactory', () => {
  let service: SemanticService;

  beforeAll(async () => {
    service = new SemanticService();
  });

  it('should throw exception for invalid versions', () => {
    expect(() => service.isOutdated('dev-master', [])).toThrow('Invalid version number: dev-master')
  });

  it('should be able to resolve registry types correctly', () => {
    expect(service.isOutdated('1.0.0', ['dev-master', '0.6.7', '1.0.0', '1.0.2'])).toBeTruthy()
    expect(service.isOutdated('1.0.0', ['dev-master'])).toBeFalsy()
    expect(service.isOutdated('1.0.0', ['0.5.6'])).toBeFalsy()
    expect(service.isOutdated('1.0.0', ['2.5.6'])).toBeTruthy()
    expect(service.isOutdated('^1.0.0', ['2.5.6'])).toBeTruthy()
    expect(service.isOutdated('42.6.7.9.3-alpha', ['42.6.7'])).toBeFalsy()
    expect(service.isOutdated('42.6.7.9.3-alpha', ['42.6.8'])).toBeTruthy()
  });
});
