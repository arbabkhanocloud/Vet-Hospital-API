import Joi from "joi";

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
