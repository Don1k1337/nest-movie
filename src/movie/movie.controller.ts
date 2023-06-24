import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { MovieService } from './movie.service';
import { CreateMovieDto, EditMovieDto } from './dto';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('movies')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Get()
  getAllMovies(@GetUser('id') user: User) {
    return this.movieService.getAllMovies(user.id);
  }

  @Get(':id')
  getMovieById(
    @GetUser('id') user: User,
    @Param('id', ParseIntPipe) movieId: number,
  ) {
    return this.movieService.getMovieById(user.id, movieId);
  }

  @Post()
  createMovie(@GetUser('id') user: User, @Body() dto: CreateMovieDto) {
    return this.movieService.createMovie(user.id, dto);
  }

  @Put(':id')
  editMovieById(
    @GetUser('id') user: User,
    @Param('id', ParseIntPipe) movieId: number,
    @Body() dto: EditMovieDto,
  ) {
    return this.movieService.editMovieById(user.id, movieId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  removeMovieById(
    @GetUser('id') user: User,
    @Param('id', ParseIntPipe) movieId: number,
  ) {
    return this.movieService.removeMovieById(user.id, movieId);
  }
}
