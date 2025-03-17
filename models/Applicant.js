import { Schema, model } from "mongoose";

const applicantSchema = new Schema({
  uid: { type: String, required: true, index: true, unique: true },
  name: { type: String },
  mob: { type: Number },
  addr: { type: String },
  existing: { type: String, default: "None" },
  since: { type: Number, default: 0 },
  site_address: { type: String },
  site_city: { type: String },
  site_postal: { type: Number },
  site_area: { type: Number },
  site_floor: { type: Number },
  doa: { type: Date, default: Date.now() },
  picpath: { type: String },
  owner: { type: String },
  status: { type: Number, default: 0 },
});

export default model("Applicant", applicantSchema);
