import express from "express";
const roomRoutes = express.Router();

import { authorizeVendor } from "../Middleware/auth.user";
import upload from "../Config/multer.config";
import {
  registerRooms,
  updateRooms,
  updateRoomImageOfProperty,
} from "../Controllers/rooms.controller";

roomRoutes.post(
  "/register/:propertyId",
  authorizeVendor,
  upload.array("room-images", 5),
  registerRooms
);

roomRoutes.put(
  "/update/room/:propertyId/:roomId",
  authorizeVendor,
  updateRooms
);
roomRoutes.put(
  "/update/image/:propertyId/:roomId/:imageId",
  authorizeVendor,
  upload.single("room-image"),
  updateRoomImageOfProperty
);

export default roomRoutes;
