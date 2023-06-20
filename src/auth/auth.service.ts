import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signUp() {
    return { msg: 'signed up' };
  }

  signIn() {
    return { msg: 'signed in' };
  }
}
