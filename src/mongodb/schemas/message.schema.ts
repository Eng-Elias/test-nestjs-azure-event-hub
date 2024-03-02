import mongoose, { Schema, Document } from 'mongoose';

export interface MessageDocument extends Document {
  content: string;
  timestamp: Date;
}

export const MessageSchema: Schema = new Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const MessageModel = mongoose.model<MessageDocument>(
  'Message',
  MessageSchema,
);
