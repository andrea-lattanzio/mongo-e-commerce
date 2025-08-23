import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
