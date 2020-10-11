import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  pseudo: {
    type: String,
    required: true,
    unique: true,
  },
  mail: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  role: {
    type: String,
    enum: ["STANDARD", "MODERATOR", "ADMIN", "MUDDLE"],
    default: "STANDARD",
  },
  certified: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    enum: ["MALE", "FEMALE", "NO_INDICATION"],
    default: "NO_INDICATION",
  },
  profilePicture: {
    type: String,
  },
  coverPicture: {
    type: String,
  },
  bio: {
    type: String,
  },
  language: {
    type: String,
    enum: ["FR", "EN"],
    default: "FR",
  },
  crowned: {
    type: Boolean,
    default: false,
  },
  lastConnected: {
    type: Date,
    default: Date.now,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  blocked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  debates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "debate",
    },
  ],
  trophies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trophy",
    },
  ],
  conversations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation",
    },
  ],
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "notification",
    },
  ],
  interactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "interaction",
    },
  ],
});

userSchema.pre("save", function () {
  const hashedPassword = bcrypt.hashSync(this.password, 12);
  this.password = hashedPassword;
});

const user = mongoose.model("user", userSchema);

export default user;
