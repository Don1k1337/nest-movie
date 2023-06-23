import { IsNotEmpty, IsString } from 'class-validator';

export class EditMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  description: string;
}
