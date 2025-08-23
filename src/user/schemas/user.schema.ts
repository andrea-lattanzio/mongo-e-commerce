import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, UpdateQuery } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

@Schema({
  timestamps: true, // createdAt, updatedAT
  versionKey: false, // removes __v
})
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true }) // unique email
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: UserRole, default: UserRole.CUSTOMER }) // enum with default value
  role: string;
}

// schema will later be injected in the user module to get the model object
export const UserSchema = SchemaFactory.createForClass(User);

// add virtual property for full name
// virtual properties are NOT included by default
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.set('toObject', {
  virtuals: true,
});

// schema middlewares to handle
// schema lifecycle, in this case hashing password when inserting and updating
/* eslint-disable */
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

UserSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as UpdateQuery<User>;
  if (update && update.$set && update.$set.password) {
    update.$set.password = bcrypt.hashSync(update.$set.password, 10);
  }

  next();
});
