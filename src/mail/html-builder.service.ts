import { Injectable } from '@nestjs/common';
import { Dependency } from 'src/registry/dependency.interface';

@Injectable()
export class HtmlBuilderService {

  buildReport (data: Dependency[]): string {
    if (data.length === 0) {
      return `
        <h1>Daily Dependency Report</h1>
        <p>There is not any outdated repository.</p>
      `
    }

    let listHtml = '' 
    for (const item of data) {
      listHtml += `<li>
        <b>${item.name}</b> is outdated. (Current: ${item.currentVersion}, Latest: ${item.lastVersion})</b>
      </li>`
    }

    return `
      <h1>Daily Dependency Report</h1>
      <ul>
        ${listHtml}
      </ul>
    `
  }

}