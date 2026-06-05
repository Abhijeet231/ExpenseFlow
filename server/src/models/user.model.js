import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Creating user schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long!"],
      maxlength: [50, "Name must be less than 50 characters long!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: [6, "Password must be at least 6 characters long!"],
    },
    role: {
      type: String,
      enum: ["user", "manager"],
      default: "user",
    },
  },
  { timestamps: true },
);

// Password hashing
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Checking Password
userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

//MODEL
const User = mongoose.model("User", userSchema);

export default User;
