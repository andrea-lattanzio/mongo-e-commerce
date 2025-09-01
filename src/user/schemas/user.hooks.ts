import * as bcrypt from 'bcrypt';

export function hashPassword() {
  return async function (next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    next();
  }
}