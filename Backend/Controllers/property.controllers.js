import cloudinary from "../Config/cloud.config";
import prisma from "../DB/db";
export const registerProperty = async (req, res) => {
  try {

    const { property_name, property_desc, location, address, amenities } =
      req.body;

    if (!property_name || !property_desc || !location || !address || !amenities)
      return res.json({ error: true, message: "Fields cannot be empty" });

    const images = req.files;

    if (!images || !images.length === 0)
      return res.json({ error: true, message: "Please upload image/s" });

    const cloudResponse = await Promise.all(
      images.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "Property-Images",
          resource_type: "image",
        })
      )
    );
    const newProperty = await prisma.property.create({
      data: {
        property_name,
        property_desc,
        location,
        address,
        amenities,
        vendor_id:'',  // comes through the auth vendor middleware.
        images: {
          create: cloudResponse.map((img) => ({
            url: img.secure_url,
            publicId: img.public_id,
          })),
        },
      },
    });

    return res.json({
      error: false,
      message: "Property added successfully",
      property: newProperty,
    });
  } catch (error) {
    console.log("Error in registering property function", error);
  }
};
