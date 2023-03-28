import mongoose from "mongoose";
import { AppointmentDTO } from "../dto/Appointment.dto";
import { CURRENCY } from "../constants/Constants";

const appointmentSchema = new mongoose.Schema<keyof AppointmentDTO, any>({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  description: { type: String, required: true },
  isPaid: { type: Boolean, required: true },
  currency: {
    type: String,
    enum: Object.values(CURRENCY),
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

export const Appointments = mongoose.model("Appointment", appointmentSchema);
