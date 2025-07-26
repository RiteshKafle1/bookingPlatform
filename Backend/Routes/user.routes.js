import express from "express";
const userRoutes=express.Router();
import { registerUser } from "../Controllers/user.controller";

userRoutes.post('/register',registerUser);

export default userRoutes;