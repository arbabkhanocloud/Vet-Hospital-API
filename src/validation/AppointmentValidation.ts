import Joi from "joi";

export function validateAppointment(appointment: object) {
  const appointmentSchema = Joi.object().keys({
    patientId: Joi.string().min(24).max(24).required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    description: Joi.string().min(10).required(),
    isPaid: Joi.boolean().required(),
    currency: Joi.string().required(),
    amount: Joi.number().required(),
  });
  return appointmentSchema.validate(appointment);
}
