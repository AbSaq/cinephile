import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/user.controller";
import { validate } from "../middleware/validation.middleware";
import { updateProfileSchema, changePasswordSchema } from "../schemas";

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

router.get("/profile", getProfile);
router.put("/profile", validate(updateProfileSchema), updateProfile);
router.post("/password", validate(changePasswordSchema), changePassword);

export default router;
