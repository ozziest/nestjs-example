import { IsNotEmpty, IsUrl } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  emails: string;
}
