import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title!: string;

  @IsString()
  @IsNotEmpty()
  authors!: string;

  @IsString()
  @IsNotEmpty()
  publishedBy!: string;
}

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  authors?: string;

 @IsString()
 @IsNotEmpty()
  publishedBy?: string;
}