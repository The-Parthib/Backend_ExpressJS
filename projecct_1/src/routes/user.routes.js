import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// ===============================================
// handle middlewares for file upload
// ===============================================
const uploadFields = upload.fields([
  { name: "avatar", maxCount: 1 },
  {name: "coverImage", maxCount: 1},
]);
// ===============================================

router.route("/register").post(
  uploadFields, // line -> 11
  registerUser
);

export default router;
