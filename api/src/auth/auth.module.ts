import { Module } from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[BcryptModule, PassportModule],
  providers:[AuthService, GoogleStrategy],
  controllers:[AuthController],
  exports:[]
})
export class AuthModule {}