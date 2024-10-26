import { Module } from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import { BcryptModule } from '../bcrypt/bcrypt.module';

@Module({
  imports:[BcryptModule],
  providers:[AuthService],
  controllers:[AuthController],
  exports:[]
})
export class AuthModule {}