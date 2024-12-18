import { Schema, models, model, Model } from "mongoose";
import { IQuestion } from "../types/type";
import mongoosePaginate from "mongoose-paginate-v2";

const QuestionSchema = new Schema<IQuestion>(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
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

QuestionSchema.plugin(mongoosePaginate);

export const Question: Model<IQuestion> =
  models.Question || model<IQuestion>("Question", QuestionSchema);
