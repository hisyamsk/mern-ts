import mongoose from 'mongoose';
import { IUserDocument } from '../interface/model';
import bcrypt from 'bcrypt';
import log from '../utils/logger';

const UserSchema: mongoose.Schema<IUserDocument> =
  new mongoose.Schema<IUserDocument>(
    {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      name: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

UserSchema.pre(
  'save',
  async function (this: IUserDocument, next): Promise<void> {
    if (!this.isModified('password')) {
      return next();
    }

    try {
      const salt: string = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);

      next();
    } catch (err) {
      log.error(err);
    }
  }
);

UserSchema.methods.comparePassword = async function (
  this: IUserDocument,
  candidatePassword: string
): Promise<boolean> {
  try {
    const isPasswordMatch: boolean = await bcrypt.compare(
      candidatePassword,
      this.password
    );
    return isPasswordMatch;
  } catch (_) {
    return false;
  }
};

const UserModel = mongoose.model<IUserDocument>('User', UserSchema);

export default UserModel;
