import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    newUser.save();

    const accessToken = jwt.sign(
      {
        _id: newUser._id,
        userName: newUser.userName,
        userEmail: newUser.userEmail,
        role: newUser.role,
      },
      "JWT_SECRET",
      { expiresIn: "120m" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: {
        accessToken,
        user: {
          _id: newUser._id,
          userName: newUser.userName,
          userEmail: newUser.userEmail,
          role: newUser.role,
        },
      },
    });
  } catch (error) {
    console.error("Error in registerUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  const checkUser = await User.findOne({ userEmail });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
    },
    "JWT_SECRET",
    { expiresIn: "120m" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
    },
  });
};
