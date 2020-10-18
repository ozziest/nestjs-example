import { Dependency } from "src/registry/dependency.interface";
import { MailService } from "./mail.service";

describe('MailService', () => {
  let service: MailService;
  let mailerService;
  let htmlBuilderService;

  beforeEach(async () => {
    mailerService = jest.fn()
    htmlBuilderService = jest.fn()
    service = new MailService(mailerService, htmlBuilderService)
  });

  it('should be able to send daily report as an email', async () => {
    htmlBuilderService.buildReport = jest.fn(() => 'generated-html')
    mailerService.sendMail = jest.fn()
    const items : Dependency[] = [
      {
        name: 'my-repo',
        currentVersion: '1.0.0',
        lastVersion: '1.0.1',
        isOutdated: true
      }
    ]
    await service.sendReport('to@mail.com', items)

    expect(mailerService.sendMail.mock.calls.length).toBe(1)
    expect(mailerService.sendMail.mock.calls[0][0].to).toBe('to@mail.com')
    expect(mailerService.sendMail.mock.calls[0][0].subject).toBe('Daily Dependency Report')
    expect(mailerService.sendMail.mock.calls[0][0].html).toBe('generated-html')

    expect(htmlBuilderService.buildReport.mock.calls.length).toBe(1)
    expect(htmlBuilderService.buildReport.mock.calls[0][0]).toBe(items)
  });
});
