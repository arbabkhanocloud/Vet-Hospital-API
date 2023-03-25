import Joi from "joi";
import express from "express";
const router = express.Router();

const appointments = [
  {
    id: 1,
    startTime: "2018-03-29T13:34:00.000",
    endTime: "2018-03-29T14:34:00.000",
    description: "Arbab",
    isPaid: "Lahore",
    currency: "03070007428 ",
    amount: "5000",
  },
  {
    id: 2,
    startTime: "2018-04-29T15:34:00.000",
    endTime: "2018-04-29T1:34:00.000",
    description: "uzair",
    isPaid: "Lahore",
    currency: "03070007428 ",
    amount: "10000",
  },
  {
    id: 3,
    startTime: "2018-05-29T13:34:00.000",
    endTime: "2018-05-29T13:34:00.000",
    description: "uzair",
    isPaid: "Lahore",
    currency: "03070007428 ",
    amount: "60000",
  },
];

router.get("/getAllAppointments", (req, res) => {
  res.send(appointments);
});

router.get("/getOneAppointment/:id", (req, res) => {
  const appointment = appointments.find(
    (g) => g.id === parseInt(req.params.id)
  );
  if (!appointment)
    return res.status(404).send("Appointment with Given id is not found");
  res.send(appointment);
});

router.post("/addNewAppointment", (req, res) => {
  const { error } = validateAppointment(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const appointment = {
    id: appointments.length + 1,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    description: req.body.description,
    isPaid: req.body.isPaid,
    currency: req.body.currency,
    amount: req.body.amount,
  };
  appointments.push(appointment);
  res.send(appointment);
});

router.put("/updateAppointment/:id", (req, res) => {
  const appointment = appointments.find(
    (a) => a.id === parseInt(req.params.id)
  );
  if (!appointment)
    return res.status(404).send("appointment with Given id is not found");

  const { error } = validateAppointment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  appointment.startTime = req.body.startTime;
  appointment.endTime = req.body.endTime;
  appointment.description = req.body.description;
  appointment.isPaid = req.body.isPaid;
  appointment.currency = req.body.currency;
  appointment.amount = req.body.amount;
  res.send(appointment);
});

router.delete("/removeAppointment/:id", (req, res) => {
  const appointment = appointments.find(
    (a) => a.id === parseInt(req.params.id)
  );
  if (!appointment)
    return res.status(404).send("appointment with Given id is not found");

  const index = appointments.indexOf(appointment);
  appointments.splice(index, 1);

  res.send(appointment);
});

function validateAppointment(appointment: object) {
  const appointmentschema = Joi.object().keys({
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    description: Joi.string().required(),
    isPaid: Joi.boolean().required(),
    currency: Joi.string(),
    amount: Joi.number(),
  });
  Joi.valid;
  return appointmentschema.validate(appointment);
}

export default router;
