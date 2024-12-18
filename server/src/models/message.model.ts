import { Schema, models, model, Model } from "mongoose";
import { IMessage } from "../types/type";
import mongoosePaginate from "mongoose-paginate-v2";

const ROLES = Object.freeze({
  SYSTEM: "system",
  USER: "user",
} as const);

const MessageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: Object.values(ROLES),
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.plugin(mongoosePaginate);

export const Message: Model<IMessage> =
  models.Message || model<IMessage>("Message", MessageSchema);
