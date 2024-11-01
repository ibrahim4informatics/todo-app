import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalUserRegisterDto } from './dto/LocalUserRegisterDto';
import { LocalUserLoginDto } from './dto/LocalUserLoginDto';
import { AuthGuard } from '@nestjs/passport';
import { AuthReq, GeneralAuthenticator } from './guards/GeneralAuthenticator';
import { Response } from 'express';


@Controller("auth")
export class AuthController {


  constructor(private readonly  authService:AuthService) {}

  @Get('check')
  @UseGuards(GeneralAuthenticator)
  checkAuth(@Req() req:AuthReq){
    return this.authService.checkAuth(req)
  }
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleRedirect(){}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleLoginUserRedirect(@Req() req:AuthReq, @Res({passthrough:true})res:Response){


    return this.authService.loginGoogleUSer(req,res);
  }

  // local authentication routes
  @Post("register")
  registerUserByEmail(@Body() localUserRegisterDto: LocalUserRegisterDto) {
    return this.authService.registerLocalUser(localUserRegisterDto);
  }
  @Post("login")
  @HttpCode(HttpStatus.OK)
  loginLocalAccount(@Body() localUserLoginDto: LocalUserLoginDto, @Res({passthrough:true})res:Response) {
    return this.authService.loginLocalUser(localUserLoginDto, res);
  }
}