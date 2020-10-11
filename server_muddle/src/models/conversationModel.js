import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  speakers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
    },
  ],
});

const conversation = mongoose.model("conversation", conversationSchema);

export default conversation;
