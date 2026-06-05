import User from "../models/user.model.js";
import genAccessToken from "../utils/genAccessToken.js";
import cookieOptions from "../utils/cookieOptions.js";

// Register Controller -------------------------------------------------
export const registerUser =  async (req, res) => {
  console.log("Incoming Body:", req.body);

  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email is already registered. Please use a different email.",
    });
  }

  // Creating new user
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

  // Creating AccesToken
  const accessToken = genAccessToken(createdUser._id, createdUser.role);

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .json({
      success: true,
      message: "User registered successfully",
      user: createdUser,
    });
};


// Login Controller -------------------------------------------------
export const loginUser =  async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User Not Found!",
    });
  }

  //Checking Password
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  }

  const accessToken = genAccessToken(user._id, user.role);

  user.password = undefined;

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json({
      success: true,
      message: "User LoggedIn Successfully",
      user: user,
    });
};


// Get Current User ---------------------------------------------------
export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// Logout Controller -------------------------------------------------
export const logoutUser =  async(req,res) => {
  
   return res
   .status(200)
   .clearCookie("accessToken", cookieOptions)
   .json(new ApiResponse(200, null, "Logged Out Successfully!"))

}