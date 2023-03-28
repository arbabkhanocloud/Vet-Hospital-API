import mongoose from "mongoose";
import { PatientDTO } from "../dto/Patient.dto";
import { PETTYPE } from "../constants/Constants";

const patientSchema = new mongoose.Schema<PatientDTO>({
  petName: { type: String, required: true },
  petType: {
    type: String,
    enum: Object.values(PETTYPE),
    required: true,
  },
  ownerName: { type: String, required: true },
  ownerAddress: { type: String, required: true },
  ownerPhoneNumber: { type: Number, required: true },
});

export const Patients = mongoose.model("Patient", patientSchema);
