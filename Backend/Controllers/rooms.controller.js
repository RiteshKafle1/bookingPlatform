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
export const updateRooms = async (req, res) => {
  try {
    const { room_name, room_desc, capacity, price_per_night } = req.body;
    const { propertyId, roomId } = req.params;

    const property = await prisma.property.findUnique({
      where: {
        property_id: propertyId,
      },
    });

    if (!property)
      return res.json({ error: true, message: "No property found" });

    const room = await prisma.room.findUnique({
      where: {
        room_id: roomId,
      },
    });

    if (!room) return res.json({ error: true, message: "No rooms found" });

    const updatedRoom = await prisma.room.update({
      where: {
        property_id: propertyId,
        room_id: roomId,
      },
      data: {
        room_name,
        room_desc,
        capacity,
        price_per_night,
      },
    });
    return res.json({
      error: false,
      message: "Room updation success",
      data: updatedRoom,
    });
  } catch (error) {
    console.log("Error in updating Rooms function", error);
  }
};

export const updateRoomImageOfProperty = async (req, res) => {
  try {
    const { propertyId, imageId, roomId } = req.params;

    const imageFile = req.file;

    const existingImage = await prisma.image.findFirst({
      where: {
        image_id: imageId,
        property_id: propertyId,
        room_id: roomId,
      },
    });

    if (!existingImage) {
      return res
        .status(404)
        .json({ message: "Image not found for this property" });
    }

    await cloudinary.uploader.destroy(existingImage.publicId);

    const uploadRes = await cloudinary.uploader.upload(imageFile.path, {
      folder: "Room-Images",
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
