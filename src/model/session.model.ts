import mongoose from 'mongoose';
import { ISessionDocument } from '../interface/session';

const SessionSchema: mongoose.Schema<ISessionDocument> =
  new mongoose.Schema<ISessionDocument>({
    name: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    valid: {
      type: Boolean,
      default: true,
    },
    userAgent: {
      type: String,
    },
  });

const SessionModel = mongoose.model<ISessionDocument>('Session', SessionSchema);

export default SessionModel;
