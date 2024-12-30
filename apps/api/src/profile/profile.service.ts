import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfileDto, EditProfileDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  getProfiles(userId: number) {
    return this.prisma.profile.findMany({
      where: {
        userId,
      },
    });
  }

  getProfileById(userId: number, profileId: number) {
    return this.prisma.profile.findFirst({
      where: {
        id: profileId,
        userId,
      },
    });
  }

  async createProfile(userId: number, dto: CreateProfileDto) {
    const profile = await this.prisma.profile.create({
      data: {
        userId,
        ...dto,
      },
    });
    return profile;
  }

  async editProfileById(userId: number, dto: EditProfileDto) {
    return this.prisma.profile.update({
      where: {
        userId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteProfileById(userId: number, profileId: number) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        id: profileId,
      },
    });

    // check if user owns the profile
    if (!profile || profile.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.profile.delete({
      where: {
        id: profileId,
      },
    });
  }
}
