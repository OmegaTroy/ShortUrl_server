import { Router } from "express";
import {
  register,
  login,
  logout,
  tokenVerify,
  profile,
  updateProfile,
  deleteAccount,
} from "../controllers/user.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validate.middlewares.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", authRequired, profile);
router.get("/verify", tokenVerify);
router.put("/profile", authRequired, updateProfile);
router.delete("/profile", authRequired, deleteAccount);

export default router;
