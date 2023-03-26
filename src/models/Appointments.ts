import mongoose from "mongoose";
import Joi from "joi";

type IAppointments = {
  patientId: mongoose.Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  description: String;
  isPaid: Boolean;
  currency?: String;
  amount?: Number;
};

const appointmentSchema = new mongoose.Schema<keyof IAppointments, any>({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  description: { type: String, required: true },
  isPaid: { type: Boolean, required: true },
  currency: {
    type: String,
    enum: ["USD", "EUR", "Bitcoin"],
    description: "Fee can only be in either USD or EUR or Bitcoin",
    required: function () {
      return this.isPaid;
    },
  },
  amount: {
    type: Number,
    required: function () {
      return this.isPaid;
    },
  },
});

export const Appointments = mongoose.model("Appointment", appointmentSchema);

export function validateAppointment(appointment: object) {
  const appointmentSchema = Joi.object().keys({
    patientId: Joi.string().min(24).max(24).required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    description: Joi.string().min(10).required(),
    isPaid: Joi.boolean().required(),
    currency: Joi.string().when("isPaid", {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),
    amount: Joi.number().when("isPaid", {
      is: true,
      then: Joi.number().required(),
      otherwise: Joi.forbidden(),
    }),
  });
  return appointmentSchema.validate(appointment);
}
