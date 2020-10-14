import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "report",
    },
  ],
  debate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "debate",
    required: true,
  },
});

const comment = mongoose.model("comment", commentSchema);

export default comment;
