import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalUserRegisterDto } from './dto/LocalUserRegisterDto';
import { LocalUserLoginDto } from './dto/LocalUserLoginDto';


@Controller("auth")
export class AuthController {


  constructor(private readonly  authService:AuthService) {}
  // local authentication routes
  @Post("register")
  registerUserByEmail(@Body() localUserRegisterDto: LocalUserRegisterDto) {
    return this.authService.registerLocalUser(localUserRegisterDto);
  }
  @Post("login")
  @HttpCode(HttpStatus.OK)
  loginLocalAccount(@Body() localUserLoginDto: LocalUserLoginDto) {
    return this.authService.loginLocalUser(localUserLoginDto);
  }
}