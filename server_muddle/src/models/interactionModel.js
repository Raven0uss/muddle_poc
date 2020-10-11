import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "LIKE",
      "DISLIKE",
      "COMMENT",
      "POSITIVE_VOTE",
      "NEGATIVE_VOTE",
      "BLUE_VOTE",
      "RED_VOTE",
    ],
    required: true,
  },
  who: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  debate: {
    // *_VOTE ONLY
    type: mongoose.Schema.Types.ObjectId,
    ref: "debate",
  },
  comment: {
    // COMMENT LIKE DISLIKE ONLY
    type: mongoose.Schema.Types.ObjectId,
    ref: "comment",
  },
});

const interaction = mongoose.model("interaction", interactionSchema);

export default interaction;
