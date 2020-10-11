import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
 
});

const notification = mongoose.model("notification", notificationSchema);

export default notification;
