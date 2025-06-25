import { Router } from "express";
import medicalRecordsRoutes from "./medical-records";
import appointmentsRoutes from "./appointments";

const router = Router();

router.use("/medical-records", medicalRecordsRoutes);
router.use("/appointments", appointmentsRoutes);

export default router;