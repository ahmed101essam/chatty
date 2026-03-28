import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format.",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    console.log("Error in signup controller: ", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.log("Error in login controller: ", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const logout = async (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 0,
  });
  res.status(200).json({
    message: "Logged out successfully",
  });
};

export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { profilePic } = req.body;

    if (!profilePic) {
      return res.status(400).json({ message: "profilePic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "chatty/profile_pics",
      overwrite: true,
      resource_type: "image",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });

    if (!uploadResponse || !uploadResponse.secure_url) {
      return res
        .status(500)
        .json({ message: "Could not upload profile image" });
    }

    req.user.profilePic = uploadResponse.secure_url;
    await req.user.save();

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePic: req.user.profilePic,
    });
  } catch (err) {
    console.error("Error in updateProfile controller:", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
