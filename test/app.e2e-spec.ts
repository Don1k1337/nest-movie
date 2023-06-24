import * as pactum from 'pactum';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/user/dto';
import { CreateMovieDto, EditMovieDto } from '../src/movie/dto';

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

    describe('Should edit the current user', () => {
      it('should edit the user', () => {
        const dto: EditUserDto = {
          firstName: 'Tester',
          email: 'tester@test.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: `Bearer $S{userAccessToken}`,
          })
          .expectStatus(200)
          .withBody(dto)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });
  describe('Movies', () => {
    describe('Get empty movies', () => {
      it('should get movies', () => {
        return pactum
          .spec()
          .get('/movies')
          .withHeaders({
            Authorization: `Bearer $S{userAccessToken}`,
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Should add movie', () => {
      const dto: CreateMovieDto = {
        title: 'First Movie',
        description: 'First movie description',
      };
      it('should add new movie', () => {
        return pactum
          .spec()
          .post('/movies')
          .withHeaders({
            Authorization: `Bearer $S{userAccessToken}`,
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('movieId', 'id');
      });
    });

    describe('Get movies', () => {
      it('should get the movies', () => {
        return pactum
          .spec()
          .get('/movies')
          .withHeaders({
            Authorization: `Bearer $S{userAccessToken}`,
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get movie by id', () => {
      it('should get the movie by id', () => {
        return pactum
          .spec()
          .get('/movies')
          .withPathParams('id', `$S{movieId}`)
          .withHeaders({
            Authorization: `Bearer $S{userAccessToken}`,
          })
          .expectStatus(200)
          .expectBodyContains(`$S{movieId}`);
      });
    });

    describe('Edit movie by id', () => {
      const dto: EditMovieDto = {
        title: 'Inception',
        description: `A skilled thief is given a final mission to implant an idea into a target's subconscious.`,
      };
      it('should edit the movie by id', () => {
        return pactum
          .spec()
          .put(`/movies/{id}`)
          .withPathParams('id', `$S{movieId}`)
          .withHeaders({
            Authorization: `Bearer $S{userAccessToken}`,
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });
  });

  describe('Delete movie by id', () => {
    it('should delete the movie by id', () => {
      return pactum
        .spec()
        .delete(`/movies/{id}`)
        .withPathParams('id', `$S{movieId}`)
        .withHeaders({
          Authorization: `Bearer $S{userAccessToken}`,
        })
        .expectStatus(204);
    });

    it('should return empty movie', () => {
      return pactum
        .spec()
        .get(`/movies`)
        .withPathParams('id', `$S{movieId}`)
        .withHeaders({
          Authorization: `Bearer $S{userAccessToken}`,
        })
        .expectStatus(200)
        .expectJsonLength(0);
    });
  });
});
