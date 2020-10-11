import mongoose from "mongoose";

const debateSchema = new mongoose.Schema({
  owner: {
    // STANDARD DEBATE ONLY
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  ownerBlue: {
    // DUO DEBATE ONLY
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  ownerRed: {
    // DUO DEBATE ONLY
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  content: {
    type: String,
    required: true,
  },
  timelimit: {
    type: Date,
  },
  type: {
    type: String,
    enum: ["STANDARD", "DUO"],
    default: "STANDARD",
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
  topComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comment",
  },
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "report",
    },
  ],
  positive: [
    // STANDARD DEBATE ONLY
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  negative: [
    // STANDARD DEBATE ONLY
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  redVotes: [
    // DUO DEBATE ONLY
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  blueVotes: [
    // DUO DEBATE ONLY
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  winner: {
    // DUO DEBATE ONLY
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  loser: {
    // DUO DEBATE ONLY
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  closed: {
    type: Boolean,
    default: false,
  },
  crowned: {
    type: Boolean,
    default: false,
  },
  interactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "interaction",
    },
  ],
});

const debate = mongoose.model("debate", debateSchema);

export default debate;
