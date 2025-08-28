import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // registering the new collection
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [MongooseModule], // only needed if user model needs to be used in other modules
})
export class UserModule { }
