import mongoose, { Schema } from 'mongoose';
import { IOtp } from '../interfaces';

const otpSchema = new Schema<IOtp>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300,
    },
  },
  { timestamps: false },
);

const Otp = mongoose.model<IOtp>('otps', otpSchema);
export default Otp;
