import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServiceController } from './service/service.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    MovieModule,
    PrismaModule,
  ],
  controllers: [ServiceController],
})
export class AppModule {}
