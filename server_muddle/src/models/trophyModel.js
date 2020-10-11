import mongoose from "mongoose";

const trophySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  won: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    enum: ["DUO", "TOP_COMMENT"],
    required: true,
  },
  debate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "debate",
  },
  comment: {
    // TOP COMMENT ONLY
    type: mongoose.Schema.Types.ObjectId,
    ref: "comment",
  },
});

const trophy = mongoose.model("trophy", trophySchema);

export default trophy;
