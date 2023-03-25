import mongoose from "mongoose";
import express from "express";
const app = express();

mongoose
  .connect("mongodb://localhost/Hospital-Api")
  .then(() => console.log("Connected to the MongoDb..."))
  .catch((err) => console.error("Could not connect to MongoDb..."));

import patients from "./routes/Patients";
import appointments from "./routes/Appointments";

app.use(express.json());
app.use("/api/patients", patients);
app.use("/api/appointments", appointments);

// const port = process.env.PORT || 3000;
const port = 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
