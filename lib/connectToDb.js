import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("Connected");
      })
      .catch((err) => {
        console.log(err.message);
      });
  } catch (err) {
    console.error(err.message || err);
  }
};
