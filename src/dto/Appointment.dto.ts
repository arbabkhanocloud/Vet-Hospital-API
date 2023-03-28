import mongoose from "mongoose";

export type AppointmentDTO = {
  patientId: mongoose.Schema.Types.ObjectId | string;
  startTime: Date;
  endTime: Date;
  description: String;
  isPaid: Boolean;
  currency: String;
  amount: Number;
};
