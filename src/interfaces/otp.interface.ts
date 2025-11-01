import { Document, Types } from 'mongoose';

export interface IOtp extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  otp: string;
  createdAt: Date;
}
