import express from "express";
import cors from "cors";
import fileuploader from "express-fileupload";
import dotenv from "dotenv";
import { connectToDb } from "./lib/connectToDb.js";
import authRoutes from "./modules/auth/routes.js";
import salesRoutes from "./modules/sales/routes.js";
import applicantRoutes from "./modules/applicant/routes.js";
import User from "./modules/auth/model.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileuploader());
app.use(cors());

connectToDb();

// Register routes - change to use actual API endpoints not just /api prefix
app.use("/", authRoutes);
app.use("/", salesRoutes);
app.use("/", applicantRoutes);

app.listen(2005, async function () {
  console.log("Server Started on port 2005...");

  const adminExists = await User.findOne({ user: "admin" });
  if (!adminExists) {
    const adminUser = new User({
      user: "admin",
      pwd: "admin123",
      role: "admin",
    });
    await adminUser.save();
    console.log("Admin user created successfully");
  }
});
