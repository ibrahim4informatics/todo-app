import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import * as process from 'node:process';


export interface AuthReq extends Request {
  user?: any;
}

@Injectable()
export class GeneralAuthenticator implements CanActivate {
  constructor(private readonly jwtService: JwtService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthReq>();
    const response = context.switchToHttp().getResponse<Response>()
    const accessToken = request.cookies['access-token'];
    if (!accessToken) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verify(accessToken, { secret: process.env.ACESS_SECRET });
      request.user = payload;
      return true;

    } catch {

      const refreshToken = request.cookies['refresh-token'];
      if (!refreshToken) throw new UnauthorizedException('login again');
      try {
        const payload = this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_SECRET });
        const newAccessToken = this.jwtService.sign({uid: payload.uid, pid: payload.pid},{secret:process.env.ACCESS_SECRET, expiresIn:'5m'});
        response.cookie('access-token', newAccessToken, {httpOnly:true, sameSite:'strict', secure:process.env.MODE !== 'dev', maxAge: 1000 * 60 * 5 /* 5m in ms*/});
        request.user = payload
        return true

      } catch {
        throw new UnauthorizedException('login again');
      }
    }
  }
}
