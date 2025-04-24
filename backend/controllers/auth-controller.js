import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  try {
    const existingUser = await User.findOne({
      userEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      userEmail,
      role,
      password: hashPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(200).json({
        success: true,
        message: "User registed successfully",
        _id: newUser._id,
        userName: newUser.userName,
        userEmail: newUser.userEmail,
        role: newUser.role,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in registerUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  try {
    const checkUser = await User.findOne({ userEmail });

    if (!checkUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const checkPassowrdCorrect = await bcrypt.compare(
      password,
      checkUser.password
    );

    if (!checkPassowrdCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    generateToken(checkUser._id, res);

    res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
    });
  } catch (error) {
    console.error("Error in loginUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
