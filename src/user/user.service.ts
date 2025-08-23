import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from './schemas/user.schema';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userModel.create(createUserDto);
    const userPlainObject = user.toObject();

    return UserResponseDto.fromDocument(userPlainObject);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find().lean();

    return UserResponseDto.fromDocuments(users);
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).lean();

    return UserResponseDto.fromDocument(user!);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel
      .findOneAndUpdate({ _id: id }, { $set: updateUserDto }, { new: true })
      .lean();

    return UserResponseDto.fromDocument(user!);
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete({ _id: id }).lean();

    return UserResponseDto.fromDocument(user!);
  }
}
