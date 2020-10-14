import mongoose from "mongoose";

const defaultBirthdateMin = new Date('01 January 1900 00:00:00 UTC');
const adTargetSchema = new mongoose.Schema({
    gender: {
        type: ["MALE", "FEMALE", "ALL"],
        default: "ALL"
    },
    birthdateMin: {
        type: Date,
        default: defaultBirthdateMin,
    },
    birthdateMax: {
        type: Date,
        default: Date.now,
    },
});

const adTarget = mongoose.model("adTarget", adTargetSchema);

export default adTarget;
