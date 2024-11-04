import { Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/UpdateProfileDto';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserProfile(profileId: number) {
    const profile: Profile = await this.prismaService.profile.findUnique({
      where: { id: profileId },
    });
    if (!profile)
      throw new NotFoundException('Can not find the profile', {
        description: 'id does not refer to any profile',
        cause: 'invalid id',
      });
    return { profile };
  }

  async updateUserProfile(
    profileId: number,
    updateProfileDto: UpdateProfileDto,
  ) {
    const profile: Profile = await this.prismaService.profile.findUnique({
      where: { id: profileId },
    });
    if (!profile)
      throw new NotFoundException('Can not find the profile', {
        description: 'id does not refer to any profile',
        cause: 'invalid id',
      });

    await this.prismaService.profile.update({
      where: { id: profileId },
      data: updateProfileDto,
    });

    return {message:"user profile updated successfull"}
  }
}
