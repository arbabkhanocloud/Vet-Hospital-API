import mongoose from "mongoose";
import Joi from "joi";

const patientSchema = new mongoose.Schema({
  petName: { type: String, require: true },
  petType: { type: String, enum: ["cat", "dog", "bird"], require: true },
  ownerName: { type: String, require: true },
  ownerAddress: { type: String, require: true },
  ownerPhoneNumber: { type: Number, require: true },
});

export const Patients = mongoose.model("Patient", patientSchema);

export function validatePatient(patient: object) {
  const patientSchema = Joi.object().keys({
    petName: Joi.string().min(3).required(),
    petType: Joi.string().max(6).required(),
    ownerName: Joi.string().required(),
    ownerAddress: Joi.string().required(),
    ownerPhoneNumber: Joi.number(),
  });
  Joi.valid;
  return patientSchema.validate(patient);
}
