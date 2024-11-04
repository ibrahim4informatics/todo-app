import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GeneralAuthenticator } from 'src/auth/guards/GeneralAuthenticator';
import { ProfileService } from './profile.service';
import { User } from 'src/decorators/User';
import { UpdateProfileDto } from './dto/UpdateProfileDto';

@Controller('profile')
@UseGuards(GeneralAuthenticator)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getUserProfile(@User('pid') profileId: number) {
    return this.profileService.getUserProfile(profileId);
  }

  @Patch()
  updateUserProfile(
    @User('pid') profileId: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateUserProfile(profileId, updateProfileDto);
  }
}
