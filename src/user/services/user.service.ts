import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { UserResponseDto } from '../dto/user-response.dto';
import { User, UserModel } from '../schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from '../dto/body.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: UserModel) { }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userModel.create(createUserDto);
    const userPlainObject = user.toObject();

    return new UserResponseDto(userPlainObject);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find().lean();

    return UserResponseDto.fromArray(users);
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).orFail().lean();

    return new UserResponseDto(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel
      .findOneAndUpdate({ _id: id }, { $set: updateUserDto }, { new: true })
      .orFail()
      .lean();

    return new UserResponseDto(user);
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete({ _id: id })
      .orFail()
      .lean();

    return new UserResponseDto(user);
  }
}
