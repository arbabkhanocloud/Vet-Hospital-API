import { Appointments, validateAppointment } from "../models/Appointments";
import express from "express";
const router = express.Router();

router.get("/getAllAppointments", async (req, res) => {
  const appointments = await Appointments.find()
    .select(" patientId startTime endTime description isPaid currency amount")
    .populate("patientId", "-_id ownerName");
  res.send(appointments);
});

router.get(
  "/getAllAppointments-OfSinglePatient/:patientId",
  async (req, res) => {
    const appointments = await Appointments.find({
      patientId: req.params.patientId,
    })
      .select("patientId startTime endTime description isPaid currency amount")
      .populate("patientId", " ownerName petType");
    res.send(appointments);
  }
);

router.get("/getOneAppointment/:id", async (req, res) => {
  const appointment = await Appointments.findById(req.params.id);
  if (!appointment)
    return res.status(404).send("Appointment with Given id is not found");
  res.send(appointment);
});

router.post("/addNewAppointment", async (req, res) => {
  const { error } = validateAppointment(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let appointment = new Appointments({
    patientId: req.body.patientId,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    description: req.body.description,
    isPaid: req.body.isPaid,
    currency: req.body.currency,
    amount: req.body.amount,
  });
  appointment = await appointment.save();
  res.send(appointment);
});

router.put("/updateAppointment/:appointmentId", async (req, res) => {
  console.log("coming appointment id;  ", req.params.appointmentId);
  const isAppointmentexists = await Appointments.findById(
    req.params.appointmentId
  );
  if (!isAppointmentexists)
    return res.status(404).send("Appointment with given ID doest not exist!!!");

  const { error } = validateAppointment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const appointment = await Appointments.findByIdAndUpdate(
    req.params.appointmentId,
    {
      patientId: req.body.patientId,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      description: req.body.description,
      isPaid: req.body.isPaid,
      currency: req.body.currency,
      amount: req.body.amount,
    }
  );
  if (!appointment)
    return res.status(404).send("Appointment with given ID doest not exist!!!");

  res.send(appointment);
});

router.delete("/removeAppointment/:appointmentId", async (req, res) => {
  const appointment = await Appointments.findByIdAndRemove(
    req.params.appointmentId
  );

  if (!appointment)
    return res.status(404).send("Appointment with Given ID Does not exist");

  res.send(appointment);
});

router.get("/unPaid", async (req, res) => {
  const appointments = await Appointments.find({
    isPaid: "false",
  })
    .populate("patientId", "-_id ownerName")
    .select("patientId startTime endTime description")
    .populate("patientId", " ownerName petType");
  res.send(appointments);
});

export default router;
