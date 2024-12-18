import { Schema, models, model, Model } from "mongoose";
import { IDocument } from "../types/type";

const DocumentSchema = new Schema<IDocument>(
   {
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    content: {
        type: String,
        required: [true, "Content is required"],
    },
  }
);

export const Document: Model<IDocument> =
    models.Document || model<IDocument>("Document", DocumentSchema);

export default Document;