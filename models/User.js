import { Schema, model } from "mongoose";

const userSchema = new Schema({
  user: { type: String, required: true, unique: true },
  pwd: { type: String },
  role: { type: String, default: "user" },
});

export default model("User", userSchema);
