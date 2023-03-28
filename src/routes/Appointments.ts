import { asyncMiddleware } from "../middleware/AsyncMiddlware";
import {
  addNewAppointment,
  getAllAppointments,
  getAllAppointmentsOfSinglePatient,
  updateAppointment,
  removeAppointment,
  unPaidAppointments,
  specificDayAppointments,
  patientRemainingBill,
  weeklyAndMonthlyReport,
  hospitalPopularPet,
} from "../controllers/Appointments";
import express from "express";
const router = express.Router();

router.post("/addNewAppointment", asyncMiddleware(addNewAppointment));
router.get("/getAllAppointments", asyncMiddleware(getAllAppointments));
router.get(
  "/specificPatientAppointments/:patientId",
  asyncMiddleware(getAllAppointmentsOfSinglePatient)
);
router.put(
  "/updateAppointment/:appointmentId",
  asyncMiddleware(updateAppointment)
);
router.delete(
  "/removeAppointment/:appointmentId",
  asyncMiddleware(removeAppointment)
);
router.get("/unPaid", asyncMiddleware(unPaidAppointments));
router.get(
  "/specificDayAppointments/:date",
  asyncMiddleware(specificDayAppointments)
);
router.get(
  "/patient-remaining-bill/:patientId",
  asyncMiddleware(patientRemainingBill)
);
router.get(
  "/weekly-monthly-data/:date",
  asyncMiddleware(weeklyAndMonthlyReport)
);
router.get("/popularPet", asyncMiddleware(hospitalPopularPet));
export default router;
