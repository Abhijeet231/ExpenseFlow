import User from "../models/user.model.js";
import genAccessToken from "../utils/genAccessToken.js";
import cookieOptions from "../utils/cookieOptions.js";

// Register Controller -------------------------------------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered. Please use a different email.",
      });
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role,
    });

    await user.save();

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
      return res.status(500).json({
        success: false,
        message: "User registration failed. Please try again.",
      });
    }

    const accessToken = genAccessToken(createdUser._id, createdUser.role);

    return res
      .status(201)
      .cookie("accessToken", accessToken, cookieOptions)
      .json({
        success: true,
        message: "User registered successfully",
        user: createdUser,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Login Controller -------------------------------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = genAccessToken(user._id, user.role);

    // Strip password from response without mutating the document permanently
    const userObj = user.toObject();
    delete userObj.password;

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .json({
        success: true,
        message: "Logged in successfully",
        user: userObj,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Get Current User ---------------------------------------------------
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Logout Controller -------------------------------------------------
export const logoutUser = async (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};