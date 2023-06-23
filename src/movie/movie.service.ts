import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto, EditMovieDto } from './dto';

@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}

  getAllMovies(userId: number) {
    return this.prisma.movie.findMany({
      where: {
        userId: userId,
      },
    });
  }

  getMovieById(userId: number, movieId: number) {
    return this.prisma.movie.findFirst({
      where: {
        id: movieId,
        userId,
      },
    });
  }

  async createMovie(userId: number, dto: CreateMovieDto) {
    const movie = await this.prisma.movie.create({
      data: {
        userId,
        ...dto,
      },
    });

    return movie;
  }

  async editMovieById(userId: number, movieId: number, dto: EditMovieDto) {
    // get the movie by id
    const movie = await this.prisma.movie.findUnique({
      where: {
        id: movieId,
      },
    });

    // check if user owns the movie
    if (!movie || movie.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.movie.update({
      where: {
        id: movieId,
      },
      data: {
        ...dto,
      },
    });
  }

  async removeMovieById(userId: number, movieId: number) {
    const movie = await this.prisma.movie.findUnique({
      where: {
        id: movieId,
      },
    });

    // check if user owns the movie
    if (!movie || movie.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.movie.delete({
      where: {
        id: movieId,
      },
    });
  }
}
