import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super({
      clientID: '82949224144-bpajfajd4ekhe2gg51gj2ndu4e14vd1m.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL:  "http://localhost:5000/auth/google/redirect",
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile,done:VerifyCallback): Promise<any> {
    const email = profile.emails[0].value;
    console.log(profile);
    const user = await this.prismaService.user.findUnique({ where: { email }, include:{profile:true} });
    if (user && user.password) return done(new Error("user already exists with local"),null);
    if (user && user.google_id) return done(null,{uid:user.id, pid:user.profile.id});
    if (!user) {
      const newUser = await this.prismaService.user.create({
        data: {
          email, google_id: profile.id, password: null,
          profile: {
            create: {
              first_name: profile.name?.familyName || profile.displayName,
              last_name: profile.name?.givenName || profile.displayName,
              bio: null,
            },
          },
        },
        select:{
          id:true,
          profile:{select:{id:true}}
        }
      });

      return done(null,{uid:newUser.id,pid:newUser.profile.id});

    } else {
      return done(new Error("Error occurred while login with google "),null);
    }

  }

}