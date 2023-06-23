import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    const createUserData: Prisma.UserCreateInput = {
      email: dto.email,
      hash,
    };

    try {
      const user = await this.prisma.user.create({
        data: createUserData,
      });

      return this.signToken(user.id, user.email);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // "Unique constraint failed on the {constraint}" check
        if (e.code === 'P2002') {
          throw new ForbiddenException('Credentials already taken!');
        }
      }

      throw e;
    }
  }

  async signIn(dto: AuthDto) {
    // find the user by provided email in the db
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user was not found in the db
    if (!user) throw new ForbiddenException('Credentials was incorrect!');

    // else, comparing pwd
    const pwdMatches = await argon.verify(user.hash, dto.password);

    // if pwd did not match
    if (!pwdMatches) throw new ForbiddenException('Credentials was incorrect!');

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }
}
