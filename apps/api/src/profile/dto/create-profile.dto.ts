import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  hobbies: string[];
}
