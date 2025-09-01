import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './services/user.service';
import { Schema } from 'mongoose';
import { hashPassword } from './schemas/user.hooks';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema: Schema = UserSchema;
          schema.pre('save', hashPassword());
          schema.pre('findOneAndUpdate', hashPassword());

          return schema;
        }
      }
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
