import { errorHandler } from "./middleware/Error";
import { databseConnection } from "./config/DatabaseConnection";
import patients from "./routes/Patients";
import appointments from "./routes/Appointments";
import express from "express";
const app = express();

app.use(express.json());
app.use("/api/patients", patients);
app.use("/api/appointments", appointments);
app.use(errorHandler);

const port = 3000;
app.listen(port, async () => {
  try {
    await databseConnection();
    console.log(`listening on port ${port}...`);
  } catch (error) {
    console.error("Could not connect to MongoDb...", error);
  }
});
