import { Exclude, Type } from 'class-transformer';
import { UserDocument } from '../schemas/user.schema';

export class UserResponseDto {
  @Type(() => String)
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;

  @Exclude()
  password: string;

  constructor(partial: UserDocument) {
    Object.assign(this, partial);
  }

  static fromArray(userDocuments: UserDocument[]): UserResponseDto[] {
    return userDocuments.map((userDoc) => new UserResponseDto(userDoc));
  }
}
