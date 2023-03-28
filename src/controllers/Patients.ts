import { Patients } from "../models/Patient";
import { validatePatient } from "../validation/PatientValidation";
import { Request, Response } from "express";

export const getAllPatient = async (req: Request, res: Response) => {
  const patients = await Patients.find().sort("ownerName");
  res.send(patients);
};

export const getOnePatient = async (req: Request, res: Response) => {
  const patient = await Patients.findById(req.params.id);
  if (!patient)
    return res.status(404).send("Patient with given id is not found!!!");
  res.send(patient);
};

export const addNewPatient = async (req: Request, res: Response) => {
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
};

export const updatePatient = async (req: Request, res: Response) => {
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
};

export const removePatient = async (req: Request, res: Response) => {
  const patient = await Patients.findByIdAndRemove(req.params.id);
  if (!patient)
    return res.status(404).send("Patient with Given id is not found");

  res.send(patient);
};

export async function popularPet() {
  const popular = await Patients.aggregate([
    { $group: { _id: "$petType", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
    { $project: { petType: "$_id", count: 1, _id: 0 } },
  ]);
  return popular;
}
