import { Router } from "express";
import medicalRecordsRoutes from "./medical-records";

const router = Router();

router.use("/medical-records", medicalRecordsRoutes);

export default router;