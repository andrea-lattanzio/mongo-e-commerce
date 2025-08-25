import { IsNotEmpty, IsString } from "class-validator";

export class FindByCategoryDto {
  @IsString()
  @IsNotEmpty()
  category: string;
}