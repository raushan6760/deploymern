import express from "express";
import { register,login,logout, getUser, getEmployerdetailsBYID} from "../controllers/userControllers.js"; 
import {isAuthenticated} from "../middlewares/auth.js"

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/logout",isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);
router.get("/getemployee/:id",isAuthenticated,getEmployerdetailsBYID)

export default router;