import { popularPet } from "../controllers/Patients";
import Converter from "../helper/CurrencyConverter";
import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";
import { Appointments } from "../models/Appointments";
import { validateAppointment } from "../validation/AppointmentValidation";

export const addNewAppointment = async (req: Request, res: Response) => {
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
};

export const getAllAppointments = async (req: Request, res: Response) => {
  const appointments = await Appointments.find()
    .select(" patientId startTime endTime description isPaid currency amount")
    .populate("patientId", "-_id ownerName");
  res.send(appointments);
};

export const getAllAppointmentsOfSinglePatient = async (
  req: Request,
  res: Response
) => {
  const appointments = await Appointments.find({
    patientId: req.params.patientId,
  })
    .select("patientId startTime endTime description isPaid currency amount")
    .populate("patientId", " ownerName petType");
  res.send(appointments);
};

export const updateAppointment = async (req: Request, res: Response) => {
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
};

export const removeAppointment = async (req: Request, res: Response) => {
  const appointment = await Appointments.findByIdAndRemove(
    req.params.appointmentId
  );

  if (!appointment)
    return res.status(404).send("Appointment with Given ID Does not exist");

  res.send(appointment);
};

export const unPaidAppointments = async (req: Request, res: Response) => {
  const appointments = await Appointments.find({
    isPaid: "false",
  })
    .populate("patientId", "-_id ownerName")
    .select("patientId startTime endTime description isPaid currency amount")
    .populate("patientId", " ownerName petType");
  res.send(appointments);
};

export const specificDayAppointments = async (req: Request, res: Response) => {
  const currentDate = new Date(req.params.date);
  const startOfDayDate = startOfDay(currentDate);
  const endOfDayDate = endOfDay(currentDate);
  const appointments = await Appointments.find({
    startTime: {
      $gte: startOfDayDate,
      $lte: endOfDayDate,
    },
  })
    .select("patientId startTime endTime description isPaid currency amount")
    .populate("patientId", " ownerName petType");

  if (appointments.length === 0)
    return res.status(400).send("No Appointments Found of specific day.!!!");

  res.send(appointments);
};

export const patientRemainingBill = async (req: Request, res: Response) => {
  const patientRemainingBill = await Appointments.aggregate([
    {
      $match: {
        patientId: new ObjectId(req.params.patientId),
        isPaid: false,
      },
    },
    {
      $group: {
        _id: "$patientId",
        Remaining_Amount: { $sum: "$amount" },
      },
    },
  ]);
  res.send(patientRemainingBill);
};

export const weeklyMonthlyReport = async (req: Request, res: Response) => {
  const currentDate = new Date(req.params.date);
  const startOfWeekDate = startOfWeek(currentDate);
  const endOfWeekDate = endOfWeek(currentDate);
  const startOfMonthDate = startOfMonth(currentDate);
  const endOfMonthDate = endOfMonth(currentDate);
  const weeklyPaid = await Appointments.aggregate([
    {
      $match: {
        startTime: {
          $gte: startOfWeekDate,
        },
        endTime: { $lt: endOfWeekDate },
        isPaid: true,
      },
    },
    {
      $group: {
        _id: null,
        PaidAmount: { $sum: "$amount" },
      },
    },
  ]);
  const weeklyPaidAmount = weeklyPaid[0].PaidAmount;
  const weeklyUnPaid = await Appointments.aggregate([
    {
      $match: {
        startTime: {
          $gte: startOfWeekDate,
        },
        endTime: { $lt: endOfWeekDate },
        isPaid: false,
      },
    },
    {
      $group: {
        _id: null,
        unPaidAmount: { $sum: "$amount" },
      },
    },
  ]);
  const weeklyUnPaidAmount = weeklyUnPaid[0].unPaidAmount;
  const monthlyPaid = await Appointments.aggregate([
    {
      $match: {
        startTime: {
          $gte: startOfMonthDate,
        },
        endTime: { $lt: endOfMonthDate },
        isPaid: true,
      },
    },
    {
      $group: {
        _id: null,
        PaidAmount: { $sum: "$amount" },
      },
    },
  ]);
  const monthlyPaidAmount = monthlyPaid[0].PaidAmount;
  const monthlyUnPaid = await Appointments.aggregate([
    {
      $match: {
        startTime: {
          $gte: startOfMonthDate,
        },
        endTime: { $lt: endOfMonthDate },
        isPaid: false,
      },
    },
    {
      $group: {
        _id: null,
        unPaidAmount: { $sum: "$amount" },
      },
    },
  ]);
  const monthlyUnPaidAmount = monthlyUnPaid[0].unPaidAmount;
  const weeklyBalance = weeklyPaidAmount + weeklyUnPaidAmount;
  const monthlyBalance = monthlyPaidAmount + monthlyUnPaidAmount;
  res.send({
    weeklyPaidAmount: weeklyPaidAmount,
    weeklyUnPaidAmount: weeklyUnPaidAmount,
    weeklyBalance: weeklyBalance,
    monthlyPaidAmount: monthlyPaidAmount,
    monthlyUnPaidAmount: monthlyUnPaidAmount,
    monthlyBalance: monthlyBalance,
  });
};

export const hospitalPopularPet = async (req: Request, res: Response) => {
  const eachPetMoney = await Appointments.aggregate([
    {
      $lookup: {
        from: "patients",
        localField: "patientId",
        foreignField: "_id",
        as: "pet",
      },
    },
    { $unwind: { path: "$pet" } },
    {
      $group: {
        _id: "$pet.petType",
        petTotalMoney: { $sum: "$amount" },
      },
    },
  ]);

  const eachPetTotalMoney: { [index: string]: any } = {
    bird: 0,
    dog: 0,
    cat: 0,
  };
  for (const element of eachPetMoney) {
    eachPetTotalMoney[element._id] = element.petTotalMoney;
  }
  const popularPetDetail = await popularPet();
  res.send({ popularPetDetail, eachPetTotalMoney });
};

export const weekk = async (req: Request, res: Response) => {
  const currentDate = new Date(req.params.date);
  const startOfWeekDate = startOfWeek(currentDate);
  const endOfWeekDate = endOfWeek(currentDate);
  const startOfMonthDate = startOfMonth(currentDate);
  const endOfMonthDate = endOfMonth(currentDate);
  const weeklyPaid = await Appointments.aggregate([
    {
      $match: {
        startTime: {
          $gte: startOfWeekDate,
        },
        endTime: { $lt: endOfWeekDate },
        isPaid: false,
      },
    },
    {
      $group: {
        _id: "$currency",
        PaidAmount: { $sum: "$amount" },
      },
    },
  ]);
  const amt = await Converter(150, "USD", "EUR");
  console.log("amount:  ", amt);
  res.send(weeklyPaid);
};
