import { IsEmail, IsNotEmpty, IsString } from "class-validator";
export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email:string
}