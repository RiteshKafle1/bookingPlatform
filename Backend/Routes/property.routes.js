import express from "express";
const propertyRouter = express.Router();
import upload from "../Config/multer.config";
import { authorizeVendor } from "../Middleware/auth.user";
import {
  registerProperty,
  updateProperty,
  updateImageOfProperty,
  getAllProperty
} from "../Controllers/property.controllers";


propertyRouter.post(
  "/register/property",
  authorizeVendor,
  upload.array("property-images", 10),
  registerProperty
);
propertyRouter.put("/update/property/:id", authorizeVendor, updateProperty);

propertyRouter.put('/:propertyId/images/:imageId',authorizeVendor,upload.single('property-image'),updateImageOfProperty);

propertyRouter.get('/vendors/getAllProperty',authorizeVendor,getAllProperty);



export default propertyRouter;
