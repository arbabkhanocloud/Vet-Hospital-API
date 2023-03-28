import mongoose from "mongoose";

export const databseConnection = async () => {
  await mongoose.connect("mongodb://localhost/Hospital-Api");
  console.log("Connected to the MongoDb...");
};
