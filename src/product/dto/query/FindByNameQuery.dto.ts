import { IsNotEmpty, IsString } from "class-validator";

export class FindByNameQueryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}