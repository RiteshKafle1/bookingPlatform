import express from "express";
const userRoutes=express.Router();
import { registerUser,loginUser,logoutUser } from "../Controllers/user.controller";

userRoutes.post('/register',registerUser);
userRoutes.post('/login',loginUser);
userRoutes.post('/logout',logoutUser);

export default userRoutes;