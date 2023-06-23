import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
  // All fields can be optional for editing
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}
