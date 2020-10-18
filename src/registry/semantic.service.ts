import { Injectable } from '@nestjs/common';

@Injectable()
export class SemanticService {
  async compare(currentVersion: string, versions: string[]) {
    console.log('here', currentVersion, versions)
  }
}
