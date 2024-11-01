import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { LocalUserRegisterDto } from './dto/LocalUserRegisterDto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthServiceInterface } from './interfaces/AuthServiceInterface';
import { LocalUserLoginDto } from './dto/LocalUserLoginDto';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { User } from '@prisma/client';
import * as process from 'node:process';
import { AuthReq } from './guards/GeneralAuthenticator';
import {Response} from 'express';


@Injectable()
export class AuthService implements AuthServiceInterface {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
  ) {
  }

  async registerLocalUser(localUserRegisterDto: LocalUserRegisterDto): Promise<any> {

    const user: User | null = await this.prismaService.user.findUnique({ where: { email: localUserRegisterDto.email } });
    if (user) {
      throw new BadRequestException('email is already in use');
    }
    const newUser = await this.prismaService.user.create({
      data: {
        email: localUserRegisterDto.email,
        password: await this.bcryptService.hash(localUserRegisterDto.password),
        google_id: null,
        profile: {
          create: {
            first_name: localUserRegisterDto.first_name,
            last_name: localUserRegisterDto.last_name,
            bio: localUserRegisterDto.bio,
          },
        },
      },
      select: {
        profile: true,
        email: true,
      },
    });
    return { message: 'user created successfully', user: newUser };
  }


  async loginLocalUser(localUserLoginDto: LocalUserLoginDto,res:Response): Promise<any> {

    const user = await this.prismaService.user.findUnique({
      where: { email: localUserLoginDto.email },
      select: { id: true, password: true, profile: { select: { id: true } } },
    });
    if (!user) throw new UnauthorizedException('invalid username or password');
    const isPasswordCorrect = await this.bcryptService.compare(localUserLoginDto.password, user.password);
    if (!isPasswordCorrect) throw new UnauthorizedException('invalid email or password');

    const accessToken = this.jwtService.sign({
      uid: user.id,
      pid: user.profile.id,
    }, { secret: process.env.ACCESS_SECRET, expiresIn:'5m' });

    const refreshToken = this.jwtService.sign({
      uid: user.id,
      pid: user.profile.id,
    }, { secret: process.env.REFRESH_SECRET, expiresIn:'3d' });

    res.cookie('access-token',accessToken, {httpOnly:true, sameSite: 'strict', secure: process.env.MODE !== 'dev', maxAge: 1000 * 60 * 5 /* for 5 minutes in ms */} );
    res.cookie('refresh-token',refreshToken, {httpOnly:true, sameSite: 'strict', secure: process.env.MODE !== 'dev', maxAge: 1000 * 3600 * 24 * 3 /*for 7 days in ms*/ } );
    return {
      message:"User Logged In Successfully"
    }

  }
  async loginGoogleUSer(req:AuthReq, res:Response){
    const accessToken = this.jwtService.sign(req.user,{secret:process.env.ACCESS_SECRET, expiresIn:'5m'});
    const refreshToken = this.jwtService.sign(req.user, {secret:process.env.REFRESH_SECRET, expiresIn:'3d'});
    res.cookie('access-token',accessToken, {httpOnly:true, sameSite: 'strict', secure: process.env.MODE !== 'dev', maxAge: 1000 * 60 * 5 /* for 5 minutes in ms */} );
    res.cookie('refresh-token',refreshToken, {httpOnly:true, sameSite: 'strict', secure: process.env.MODE !== 'dev', maxAge: 1000 * 3600 * 24 * 3 /*for 7 days in ms*/ } );
    res.redirect("http://localhost:5000/auth/check");
  }

  async checkAuth(req:AuthReq){
    return { user: req.user };
  }
}