import validator from "validator";
import bcrypt from "bcrypt";
import prisma from "../DB/db";
import generateVerificationToken from "../Utils/verification.token";
import sendMail from "../Utils/send.verification.mail";
import generateJsonToken from "../Utils/json.token";
import jwt from 'jsonwebtoken';

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
export const loginUser = async (req, res) => {
  try {
    const { userEmail, password, role } = req.body;

    if (!userEmail || !password)
      return res.json({ error: true, message: "No empty fields allowed" });

    const userExists = await prisma.user.findUnique({
      where: {
        userEmail,
        role,
      },
    });

    if (!userExists) return res.json({ error: true, message: "No user found" });

    const isPassValid = await bcrypt.compare(password, userExists.password);
    if (!isPassValid)
      return res.json({ error: true, message: "Invalid credentials" });

    generateJsonToken(res, userExists.user_id);

    return res.json({
      error: false,
      message: "login Success",
      data: userExists,
    });
  } catch (error) {
    console.log("Error in login user function", error);
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      error: false,
      message: "Logged Out Success.",
    });
  } catch (error) {
    console.log("Error in login function", error);
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const jwtToken = jwt.sign({ data:email+password }, process.env.SECRET_KEY, {
        expiresIn: "3d",
      });

      return res.json({error:false,token:jwtToken});
    }
  } catch (error) {
    console.log("Error in login Admin Function", error);
  }
};
