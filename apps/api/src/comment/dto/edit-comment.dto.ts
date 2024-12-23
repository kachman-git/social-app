import { IsOptional, IsString } from 'class-validator';

export class EditCommentDto {
  @IsString()
  @IsOptional()
  text?: string;
}
