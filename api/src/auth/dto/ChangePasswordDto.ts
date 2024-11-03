import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { Equals } from 'src/custom-validators/Equals';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minSymbols: 1,
    minUppercase: 1,
    minNumbers: 1,
  })
  password: string;
  @Equals('password', { message: 'confirm does not match the password' })
  confirm: string;
}
