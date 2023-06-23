import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';

describe('App module e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3334);

    prisma = app.get(PrismaService);

    pactum.request.setBaseUrl('http://localhost:3334');

    await prisma.cleanDB();
  });

  afterAll(() => {
    app.close();
  });

  // Auth testing module
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@test.com',
      password: 'supersecurepwd',
    };

    describe('SignUp', () => {
      // Additional checks
      it('should throw an exception if email field is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw an exception if password field is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw an exception if body is empty', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400).inspect();
      });

      // Main checks
      it('should correctly sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('SignIn', () => {
      // Additional checks
      it('should throw an exception if email field is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw an exception if password field is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw an exception if body is empty', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400).inspect();
      });

      it('should correctly sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAccessToken', 'access_token');
      });
    });
  });

  // User testing module
  describe('User', () => {
    describe('Should get the current user', () => {
      it('should get the user', () => {
        return pactum
          .spec()
          .get('/users/current')
          .expectStatus(200)
          .withHeaders({
            Authorization: `Bearer $S{userAccessToken}`,
          });
      });
    });

    // describe('Should edit the current user', () => {
    //
    // })
  });
  //
  // Movie testing module
  // describe('Movie', () => {
  //   describe('Should create a new movie', () => {
  //
  //   })
  //
  //   describe('Should get the list of movies', () => {
  //
  //   })
  //
  //   describe('Should get the movie by id', () => {
  //
  //   })
  //
  //   describe('Should update the movie by id', () => {
  //
  //   })
  //
  //   describe('Should delete the current movie by id', () => {
  //
  //   })
  // });
});
