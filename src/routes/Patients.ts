import { asyncMiddleware } from "../middleware/AsyncMiddlware";
import {
  getAllPatient,
  getOnePatient,
  addNewPatient,
  updatePatient,
  removePatient,
} from "../controllers/Patients";
import express from "express";
const router = express.Router();

router.get("/getAllPatients", asyncMiddleware(getAllPatient));
router.get("/getOnePatient/:id", asyncMiddleware(getOnePatient));
router.post("/addNewPatient", asyncMiddleware(addNewPatient));
router.put("/updatePatient/:id", asyncMiddleware(updatePatient));
router.delete("/removePatient/:id", asyncMiddleware(removePatient));
export default router;
