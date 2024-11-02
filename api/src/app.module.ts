import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import {JwtModule} from '@nestjs/jwt';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, PrismaModule, JwtModule.register({global:true}), MailerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
