import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, EditPostDto } from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  getAllPosts() {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
        comments: true,
      },
    });
  }
  getPosts(userId: number) {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
        comments: true,
      },
    });
  }

  getPostById(userId: number, postId: number) {
    return this.prisma.post.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        id: postId,
        userId,
      },
    });
  }

  async createPost(userId: number, dto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        userId,
        ...dto,
      },
    });

    return post;
  }

  async editPostById(userId: number, postId: number, dto: EditPostDto) {
    // get the post by id
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    // check if user owns the post
    if (!post || post.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deletePostById(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    // check if user owns the post
    if (!post || post.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }
}
