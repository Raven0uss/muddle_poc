import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  type: {
    type: String,
    enum: ["DEBATE", "COMMENT"],
    required: true,
  },
  reason: {
    type: String,
    enum: ["INSULT", "RACISM", "SEXISM", "VIOLENCE", "PORNOGRAPHY"],
    required: true,
  },
  reasonText: {
    type: String,
  },
  debate: {
    // DEBATE ONLY
    type: mongoose.Schema.Types.ObjectId,
    ref: "debate",
  },
  comment: {
    // COMMENT ONLY
    type: mongoose.Schema.Types.ObjectId,
    ref: "comment",
  },
  treated: {
    type: Boolean,
    default: false,
  },
});

const report = mongoose.model("report", reportSchema);

export default report;
