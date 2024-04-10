import express from "express";
import {employerGetAllApplications,jobseekerGetAllApplications,jobseekerDeleteApplication, postApplication, jobseekerGetApplicationsBYID, employerDeleteApplication} from "../controllers/applicationControllers.js"
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/jobseeker/getall",isAuthenticated,jobseekerGetAllApplications)
router.get("/employer/getall",isAuthenticated,employerGetAllApplications)
router.delete("/delete/:id", isAuthenticated,jobseekerDeleteApplication)
router.delete("/deleteemployee/:id", isAuthenticated,employerDeleteApplication)
router.post("/post",isAuthenticated,postApplication)
router.put("/application/:id",jobseekerGetApplicationsBYID)

export default router;