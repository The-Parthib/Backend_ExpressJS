import { Router } from "express";
import {
  loginUser,
  logOutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAccount,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ===============================================
// handle middlewares for file upload
// ===============================================
const uploadFields = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);
// ===============================================

/**========== Register Route */
router.route("/register").post(uploadFields, registerUser); // line -> 10 to handle file upload middleware
/**========== Login Route */
router.route("/login").post(loginUser);

/**========== Secured Route */
router.route("/logout").post(verifyJWT, logOutUser); // added a middleware to verify JWT and send the user in the {res.user}
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch( verifyJWT, updateUserAccount);
// ----------------- Update User Avatar/Cover Image Route ---------------------------------------------
router.route("/update-avatar").patch( verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/update-cover").patch( verifyJWT, upload.single("coverImage", updateUserCoverImage));
// ----------------------------------------------------------------------------------------------------

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
