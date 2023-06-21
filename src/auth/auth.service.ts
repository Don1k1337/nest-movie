import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signUp() {
    return { msg: 'signed up' };
  }

  signIn() {
    return { msg: 'signed in' };
  }
}
