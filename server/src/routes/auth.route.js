import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { loginUser, registerUser, getMe, logoutUser } from "../controllers/user.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

// register
router.post("/register", validate(registerSchema), registerUser);

// login
router.post("/login", validate(loginSchema), loginUser);

// logout
router.post("/logout", verifyJWT, logoutUser)

// Get LoggedIn User
router.get("/me", verifyJWT, getMe);

export default router;