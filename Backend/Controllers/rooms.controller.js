import prisma from "../DB/db";

export const registerRooms = async (req, res) => {
  try {
    const { room_name, room_desc, capacity, price_per_night } = req.body;
    const { propertyId } = req.params;

    if (!room_name || !room_desc || !capacity || !price_per_night)
      return res.json({ error: true, message: "Fields cannot be empty" });
    const roomImages = req.files;

    if (!roomImages || !roomImages.length === 0)
      return res.json({ error: true, message: "Please upload image/s" });

    const property = await prisma.property.findUnique({
      where: { property_id: propertyId },
    });
    if (!property) {
      return res.json({ error: true, message: "Property not found" });
    }

    const cloudResponse = await Promise.all(
      roomImages.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "Room-Images",
          resource_type: "image",
        })
      )
    );

    const newRoom = await prisma.room.create({
      data: {
        property_id: propertyId,
        room_name,
        room_desc,
        capacity,
        price_per_night,
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
      message: "Room Added successfully",
      data: newRoom,
    });
  } catch (error) {
    console.log("Error in registeringRoom function", error);
  }
};
export const updateRooms=async(req,res)=>{
  try {
    
  } catch (error) {
    
  }
}