import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { ProfileService } from './profile.service';
import { CreateProfileDto, EditProfileDto } from './dto';

@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get()
  getProfiles(@GetUser('id') userId: number) {
    return this.profileService.getProfiles(userId);
  }

  @Get(':id')
  getProfileById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) profileId: number,
  ) {
    return this.profileService.getProfileById(userId, profileId);
  }

  @Post()
  createProfile(@GetUser('id') userId: number, @Body() dto: CreateProfileDto) {
    return this.profileService.createProfile(userId, dto);
  }

  @Patch(':id')
  editProfileById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) profileId: number,
    @Body() dto: EditProfileDto,
  ) {
    return this.profileService.editProfileById(userId, profileId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteProfileById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) profileId: number,
  ) {
    return this.profileService.deleteProfileById(userId, profileId);
  }
}
