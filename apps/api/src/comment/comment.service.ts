import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto, EditCommentDto } from './dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  getComments(userId: number) {
    return this.prisma.comment.findMany({
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
      },
    });
  }

  getCommentById(userId: number, commentId: number) {
    return this.prisma.comment.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        id: commentId,
        userId,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async createComment(userId: number, dto: CreateCommentDto) {
    try {
      const comment = await this.prisma.comment.create({
        data: {
          userId: userId,
          text: dto.text,
          postId: dto.postId,
        },
      });

      return comment;
    } catch (error) {
      throw new ForbiddenException('Failed to create comment');
    }
  }

  async editCommentById(
    userId: number,
    commentId: number,
    dto: EditCommentDto,
  ) {
    // get the comment by id
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    // check if user owns the comment
    if (!comment || comment.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteCommentById(userId: number, commentId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    // check if user owns the comment
    if (!comment || comment.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }
}
