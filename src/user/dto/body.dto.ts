import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum } from "class-validator";
import { UserDocument, UserRole } from "../schemas/user.schema";
import { PartialType } from "@nestjs/mapped-types";
import { Exclude, plainToInstance } from "class-transformer";


export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'role must be a valid UserRole' })
  role?: UserRole;
}

export class UpdateUserDto extends PartialType(CreateUserDto) { }

export class UserResponseDto {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;

  @Exclude()
  password: string;

  static fromDocument(documentObject: UserDocument): UserResponseDto {
    return plainToInstance(UserResponseDto, documentObject);
  }

  static fromDocuments(documents: UserDocument[]): UserResponseDto[] {
    return documents.map((doc) => this.fromDocument(doc));
  }
}
