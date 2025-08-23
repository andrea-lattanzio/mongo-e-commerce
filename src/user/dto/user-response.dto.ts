import { Exclude, plainToInstance } from 'class-transformer';
import { UserDocument } from '../schemas/user.schema';

export class UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;

  @Exclude()
  password: string;
  @Exclude()
  _id: string;

  static fromDocument(documentObject: UserDocument): UserResponseDto {
    return plainToInstance(UserResponseDto, documentObject);
  }

  static fromDocuments(documents: UserDocument[]): UserResponseDto[] {
    return documents.map((doc) => this.fromDocument(doc));
  }
}
