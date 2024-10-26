import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import {JwtModule} from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, PrismaModule, JwtModule.register({global:true})],
  controllers: [],
  providers: [],
})
export class AppModule {}
