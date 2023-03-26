import mongoose from "mongoose";
import Joi from "joi";

type IPatients = {
  petName: String;
  petType: String;
  ownerName: String;
  ownerAddress: String;
  ownerPhoneNumber: Number;
};

const patientSchema = new mongoose.Schema<IPatients>({
  petName: { type: String, required: true },
  petType: {
    type: String,
    enum: ["cat", "dog", "bird"],
    message: "Pet type can be only Cat or Dog or Bird.",
    required: true,
  },
  ownerName: { type: String, required: true },
  ownerAddress: { type: String, required: true },
  ownerPhoneNumber: { type: Number, required: true },
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
