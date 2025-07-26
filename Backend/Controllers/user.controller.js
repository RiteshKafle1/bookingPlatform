import validator from "validator";
import bcrypt from "bcrypt";
import prisma from "../DB/db";
import generateVerificationToken from "../Utils/verification.token";
import sendMail from "../Utils/send.verification.mail";

export const registerUser = async (req, res) => {
  try {
    const { userName, userEmail, password, role } = req.body;
    if (!userName || !userEmail || !password || !role)
      return res.json({ error: true, message: "No empty fields allowed" });

    if (!validator.isEmail(userEmail))
      return res.json({ error: true, message: "Please enter a valid email" });

    if (!validator.isStrongPassword(password))
      return res.json({ error: true, message: "Password too weak" });

    if (!validator.isAlphanumeric(userName))
      return res.json({
        error: true,
        message: "Username should contain letters and numbers.",
      });

    const userExists = await prisma.user.findUnique({
      where: {
        userEmail,
      },
    });

    if (userExists)
      return res.json({ error: true, message: "User Already Exists." });

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const verificationToken = generateVerificationToken();

    const user = await prisma.user.create({
      data: {
        userName,
        userEmail,
        password: hashedPass,
        role,
        verification_token: verificationToken,
        verification_token_expires_at: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ),
      },
    });
    await sendMail(verificationToken, user.userEmail);

    return res.json({
      error: false,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.log("error in register user funtion", error);
  }
};
