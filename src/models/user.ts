import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces';
import { UserRole } from '../enums';

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (ret as any).__v;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (ret as any).__v;
        return ret;
      },
    },
  },
);

const User = mongoose.model<IUser>('users', userSchema);
export default User;
