import { RegistryFactory } from './registery.factory';
import { SemanticService } from './semantic.service';

describe('RegistryFactory', () => {
  let service: SemanticService;

  beforeAll(async () => {
    service = new SemanticService();
  });

  it('should be able to resolve registry types correctly', () => {
    console.log(service)
  });
});
