import { Body, Injectable, InternalServerErrorException, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { LocalUserRegisterDto } from './dto/LocalUserRegisterDto';
import {JwtService} from '@nestjs/jwt';
import { AuthServiceInterface } from './interfaces/AuthServiceInterface';
import { Response } from 'supertest';
import { LocalUserLoginDto } from './dto/LocalUserLoginDto';
import { BcryptService } from '../bcrypt/bcrypt.service';



@Injectable()
export class AuthService implements AuthServiceInterface{

  constructor(
    private readonly  prismaService:PrismaService,
    private readonly  jwtService:JwtService,
    private readonly  bcryptService:BcryptService
    ) {
  }

  async registerLocalUser(localUserRegisterDto:LocalUserRegisterDto):Promise<any>{
    return {message:"register a local user", credentials: localUserRegisterDto};
  }

  async loginLocalUser(localUserLoginDto:LocalUserLoginDto):Promise<any>{
    return {message:"login a local user", cred:localUserLoginDto,hashPass: await  this.bcryptService.hash(localUserLoginDto.password)}
  }
}