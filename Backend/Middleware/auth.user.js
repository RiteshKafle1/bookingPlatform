import jwt from "jsonwebtoken";
import prisma from "../DB/db";

export const authorizeUser = async (req, res, next) => {
  const cookieToken = req.cookies.token;

  if (!cookieToken) {
    return res.status(401).json({ message: "Not authorized,no token" });
  }

  try {
    const signId = jwt.verify(cookieToken, process.env.SECRET);

    const verifiedUser = await prisma.user.findUnique({
      where: {
        user_id: signId.userId,
        role: user,
      },
    });

    if (verifiedUser) {
      req.user = verifiedUser;
      next();
    } else {
      return res.json({ error: true, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("Error in authorize User Funtion", error);
  }
};

export const authorizeVendor = async (req, res, next) => {
  const cookieToken = req.cookies.token;

  if (!cookieToken) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  try {
    const signId = jwt.verify(cookieToken, process.env.SECRET);

    const verifiedVendor = await prisma.user.findUnique({
      where: {
        user_id: signId.userId,
        role: vendor,
      },
    });

    if (verifiedVendor) {
      req.user = verifiedVendor;
      next();
    } else {
      return res.json({ error: true, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("Error in authorize User Funtion", error);
  }
};

export const authorizeAdmin = async (req, res, next) => {
  try {
    const { adminToken } = req.headers;

    if (!adminToken)
      return res.json({ error: true, message: "Invalid Credentials" });

    const decoded_token = jwt.verify(adminToken, process.env.SECRET_KEY);

    if (
      decoded_token.data !=
      process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD
    )
      return res.json({ error: true, message: "Invalid Credentials1" });
    next();
  } catch (error) {
    console.log("Error in authAdmin function", error);
    res.json({ error: true, message: "Invalid Credentials" });
  }
};
