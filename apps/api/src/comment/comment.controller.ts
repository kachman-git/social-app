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
import { CreateCommentDto, EditCommentDto } from './dto';

import { CommentService } from './comment.service';

@UseGuards(JwtGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Get()
  getComments(@GetUser('id') userId: number) {
    return this.commentService.getComments(userId);
  }

  @Get(':id')
  getCommentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) commentId: number,
  ) {
    return this.commentService.getCommentById(userId, commentId);
  }

  @Post()
  createComment(@GetUser('id') userId: number, @Body() dto: CreateCommentDto) {
    return this.commentService.createComment(userId, dto);
  }

  @Patch(':id')
  editCommentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) commentId: number,
    @Body() dto: EditCommentDto,
  ) {
    return this.commentService.editCommentById(userId, commentId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteCommentById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) commentId: number,
  ) {
    return this.commentService.deleteCommentById(userId, commentId);
  }
}
