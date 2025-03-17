import { Schema, model } from "mongoose";

const salesSchema = new Schema({
  uid: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  sales: { type: Number },
  customers: { type: Number },
});

export default model("Sales", salesSchema);
