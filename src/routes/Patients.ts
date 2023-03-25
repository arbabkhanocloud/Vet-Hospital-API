import { validatePatient, Patients } from "../models/Patient";
import express from "express";
const router = express.Router();

router.get("/getAllPatients", async (req, res) => {
  const patients = await Patients.find().sort("ownerName");
  res.send(patients);
});

router.get("/getOnePatient/:id", async (req, res) => {
  const patient = await Patients.findById(req.params.id);
  if (!patient)
    return res.status(404).send("Patient with given id is not found!!!");
  res.send(patient);
});

router.post("/addNewPatient", async (req, res) => {
  const { error } = validatePatient(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let patient = new Patients({
    petType: req.body.petType,
    petName: req.body.petName,
    ownerName: req.body.ownerName,
    ownerAddress: req.body.ownerAddress,
    ownerPhoneNumber: req.body.ownerPhoneNumber,
  });

  patient = await patient.save();
  res.send(patient);
});

router.put("/updatePatient/:id", async (req, res) => {
  const ifPatientExist = await Patients.findById(req.params.id);
  if (!ifPatientExist)
    return res.status(404).send("Patient with given id is not found!!!");

  const { error } = validatePatient(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const patient = await Patients.findByIdAndUpdate(req.params.id, {
    petName: req.body.petName,
    petType: req.body.petType,
    ownerName: req.body.ownerName,
    ownerAddress: req.body.ownerAddress,
    ownerPhoneNumber: req.body.ownerPhoneNumber,
  });

  if (!patient)
    return res.status(404).send("Patient with Given id is not found!!!");

  res.send(patient);
});

router.delete("/removePatient/:id", async (req, res) => {
  const patient = await Patients.findByIdAndRemove(req.params.id);
  if (!patient)
    return res.status(404).send("Patient with Given id is not found");

  res.send(patient);
});

export default router;
