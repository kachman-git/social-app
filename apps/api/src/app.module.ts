import { Module } from '@nestjs/common';
import { ProfileModule } from './profile/profile.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ProfileModule,
    PostModule,
    CommentModule,
    UserModule,
  ],
})
export class AppModule {}
