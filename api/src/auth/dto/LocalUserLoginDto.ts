import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';


const blackListHostName:string[] = [
  "10minutemail.com",
  "guerrillamail.com",
  "temp-mail.org",
  "yopmail.com",
  "mailinator.com",
  "getnada.com",
  "trashmail.com",
  "throwawaymail.com",
  "dispostable.com",
  "fakeinbox.com",
  "tempail.com",
  "mohmal.com",
  "emailondeck.com",
  "mytemp.email",
  "mintemail.com",
  "maildrop.cc",
  "spamgourmet.com",
  "luxusmail.com",
  "airmail.net",
  "mailnesia.com"
];
export class LocalUserLoginDto {



  @IsString({message:"email must be text"})
  @IsNotEmpty({message:"email is required"})
  @IsEmail({host_blacklist: blackListHostName},{message:"email is not supported"})
  email:string

  @IsString({message:"password must be text"})
  @IsNotEmpty({message:"password is required"})
  @IsStrongPassword({minLength:8,minLowercase:1,minNumbers:1,minSymbols:1,minUppercase:1},{message:"Password must include at least one uppercase letter, one lowercase letter, one number, and one special character. and 8 characters long"})
  password:string
}