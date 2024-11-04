import {
  BadRequestException,
  
  ForbiddenException,
  
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LocalUserRegisterDto } from './dto/LocalUserRegisterDto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthServiceInterface } from './interfaces/AuthServiceInterface';
import { LocalUserLoginDto } from './dto/LocalUserLoginDto';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { User } from '@prisma/client';
import * as process from 'node:process';
import { AuthReq } from './guards/GeneralAuthenticator';
import { Response } from 'express';
import { ResetPasswordDto } from './dto/ResetPasswordDto';
import { MailerService } from 'src/mailer/mailer.service';
import { ChangePasswordDto } from './dto/ChangePasswordDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly mailerService: MailerService,
  ) {}

  async registerLocalUser(
    localUserRegisterDto: LocalUserRegisterDto,
  ): Promise<any> {
    const user: User | null = await this.prismaService.user.findUnique({
      where: { email: localUserRegisterDto.email },
    });
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

  async loginLocalUser(
    localUserLoginDto: LocalUserLoginDto,
    res: Response,
  ): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { email: localUserLoginDto.email },
      select: { id: true, password: true, profile: { select: { id: true } } },
    });
    if (!user) throw new UnauthorizedException('invalid username or password');
    const isPasswordCorrect = await this.bcryptService.compare(
      localUserLoginDto.password,
      user.password,
    );
    if (!isPasswordCorrect)
      throw new UnauthorizedException('invalid email or password');

    const accessToken = await this.jwtService.signAsync(
      {
        uid: user.id,
        pid: user.profile.id,
      },
      { secret: process.env.ACCESS_SECRET, expiresIn: '5m' },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        uid: user.id,
        pid: user.profile.id,
      },
      { secret: process.env.REFRESH_SECRET, expiresIn: '3d' },
    );

    res.cookie('access-token', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.MODE !== 'dev',
      maxAge: 1000 * 60 * 5 /* for 5 minutes in ms */,
    });
    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.MODE !== 'dev',
      maxAge: 1000 * 3600 * 24 * 3 /*for 7 days in ms*/,
    });
    return {
      message: 'User Logged In Successfully',
    };
  }

  async loginGoogleUSer(req: AuthReq, res: Response) {
    const accessToken = this.jwtService.sign(req.user, {
      secret: process.env.ACCESS_SECRET,
      expiresIn: '5m',
    });
    const refreshToken = this.jwtService.sign(req.user, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '3d',
    });
    res.cookie('access-token', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.MODE !== 'dev',
      maxAge: 1000 * 60 * 5 /* for 5 minutes in ms */,
    });
    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.MODE !== 'dev',
      maxAge: 1000 * 3600 * 24 * 3 /*for 7 days in ms*/,
    });
    res.redirect('http://localhost:5000/auth/check');
  }

  async checkAuth(req: AuthReq) {
    return { user: req.user };
  }

  mailCreator(token: string): string {
    return `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset</title>
                    <style>
                        /* General reset and container styling */
                        body {
                        font-family: Arial, sans-serif;
                        background-color: #f7f7f7;
                        color: #333333;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        }
                        .container {
                        max-width: 600px;
                        background-color: #ffffff;
                        padding: 20px;
                        margin: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        /* Header and Logo */
                        .header {
                        text-align: center;
                        padding: 20px 0;
                        background-color: #4a90e2;
                        color: #ffffff;
                        border-radius: 8px 8px 0 0;
                        }
                        .header h1 {
                        margin: 0;
                        font-size: 24px;
                        }
                        /* Content styling */
                        .content {
                        padding: 20px;
                        text-align: left;
                        }
                        .content h2 {
                        color: #4a90e2;
                        font-size: 20px;
                        margin-top: 0;
                        }
                        .content p {
                        font-size: 16px;
                        line-height: 1.6;
                        }
                        /* Button styling */
                        .button {
                        display: block;
                        width: fit-content;
                        margin: 20px auto;
                        padding: 12px 24px;
                        background-color: #4a90e2;
                        color: #ffffff;
                        text-align: center;
                        font-size: 16px;
                        font-weight: bold;
                        text-decoration: none;
                        border-radius: 4px;
                        }
                        .button:hover {
                        background-color: #357ABD;
                        }
                        /* Footer styling */
                        .footer {
                        font-size: 12px;
                        text-align: center;
                        color: #999999;
                        padding: 10px;
                        margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                        <h1>Password Reset Request</h1>
                        </div>
                        <div class="content">
                        <h2>Hello,</h2>
                        <p>We received a request to reset your password. Click the button below to set up a new password:</p>
                        <a href="${process.env.CLIENT_URL}/reset?token=${token}" class="button">Reset Password</a>
                        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                        <p>Thanks,<br>The IBDEV Team</p>
                        </div>
                        <div class="footer">
                        <p>If you have any questions, contact us at support@ibdev-todo.com</p>
                        </div>
                    </div>
                </body>
            </html>
    
    `;
  }
  async requestResetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email } = resetPasswordDto;
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user || !user.password)
      throw new NotFoundException('can not find user', {
        cause: 'invalid informations',
        description: 'the email provided is not linked to any local account',
      });
    const token = await this.jwtService.signAsync(
      { email: email },
      { expiresIn: '15m', secret: process.env.REFRESH_PASS_SECRET },
    );
    const htmlEmailToSend: string = this.mailCreator(token);
    const result = await this.mailerService.sendMail({
      from: `"IBDEV-TODO"<ibrahimelkhalilbenyahia@gmail.com>`,
      to: email,
      subject: 'Reset Password',
      html: htmlEmailToSend,
    });

    if (result.status == 0)
      throw new InternalServerErrorException(
        result?.message || 'Unknown server error',
        {
          cause: 'SMTP Server Error',
          description: 'Can not send email at the moment',
        },
      );
    return { message: 'Email Sent Successfully', metaData: result.message };
  }
  async checkResetPasswordUrlValid(token:string){
    if(!token) throw new UnauthorizedException("invalid or expired token", {cause:"Can not verify reset password token",description:"send a reset request the token pprovided is not valid"});
    try {
      const payload:any = await this.jwtService.verifyAsync(token,{secret:process.env.REFRESH_PASS_SECRET});
      return {message:"the reset url is valid"};

    }
    catch {
      throw new UnauthorizedException("invalid or expired token", {cause:"Can not verify reset password token",description:"send a reset request the token pprovided is not valid"})
    }
  }
  async changePassword(changePasswordDto:ChangePasswordDto, token:string){
    if(!token) throw new UnauthorizedException("Can not make this action");
    try {

      const payload:any = await this.jwtService.verifyAsync(token, {secret:process.env.REFRESH_PASS_SECRET});
      await this.prismaService.user.update({where:{email:payload.email}, data:{password: await this.bcryptService.hash(changePasswordDto.password)}});
      return {message:"password reset success"}

    }
    catch {
      throw new UnauthorizedException("Can not  make this action");
    }
  }
}
