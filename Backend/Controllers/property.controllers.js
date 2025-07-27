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
        vendor_id: "", // comes through the auth vendor middleware.
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

export const updateProperty = async (req, res) => {
  try {
    const { property_name, property_desc, location, address, amenities } =
      req.body;

    const propertyId = req.params.id;
    const property = await prisma.property.findUnique({
      where: {
        property_id: propertyId,
      },
    });

    if (!property)
      return res.json({ error: true, message: "No property found" });

    const updatedProperty = await prisma.property.update({
      where: {
        property_id: propertyId,
      },
      data: {
        property_name: property_name || property.property_name,
        property_desc: property_desc || property.property_desc,
        location: location || property.location,
        address: address || property.address,
        amenities: amenities || property.amenities,
      },
    });
  } catch (error) {
    console.log("Error in updating property", error);
  }
};

export const updateImageOfProperty = async (req, res) => {
  try {
    const { propertyId, imageId } = req.params;

    const imageFile = req.file;

    const existingImage = await prisma.image.findFirst({
      where: {
        image_id: imageId,
        property_id: propertyId,
      },
    });

    if (!existingImage) {
      return res
        .status(404)
        .json({ message: "Image not found for this property" });
    }

    await cloudinary.uploader.destroy(existingImage.publicId);

    const uploadRes = await cloudinary.uploader.upload(imageFile.path, {
      folder: "Property-Images",
      resource_type: "image",
    });
    const updatedImage = await prisma.image.update({
      where: { image_id: imageId },
      data: {
        url: uploadRes.secure_url,
        publicId: uploadRes.public_id,
      },
    });

    return res.json({
      error: false,
      message: "Image updated success",
      data: updatedImage,
    });
  } catch (error) {
    console.log("Error in updating image of a property", error);
  }
};

export const getAllProperty=async(req,res)=>{
  try {

    const properties=await prisma.property.findMany({
      where:{
        vendor_id:'' // comes through the auth vendor middleware
      },
      include:{
        images:true
      },
      orderBy:{
        created_at :'desc'
      }
    });

    if(properties.length===0)
        return res.json({error:true,message:'No properties found'});
    
    return res.json({error:false,data:properties});
    

  } catch (error) {
    console.log('Error in getAllProperty function',error);
    
  }
}