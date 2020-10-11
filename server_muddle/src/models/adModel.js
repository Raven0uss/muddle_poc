import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  targets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "adTarget",
    },
  ],
  active: {
      type: Boolean,
      default: true,
  },
  ratio: {
      type: Number,
      default: 1,
  }
});

const ad = mongoose.model("ad", adSchema);

export default ad;
