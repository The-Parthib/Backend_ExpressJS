const express = require("express");
const router = express.Router();
const {
  handleAllusers,
  handleListUsers,
  handleCreateUsers,
  getUserById,
  updateUserbyId,
  deleteUserById,
} = require("../controllers/user");


// controllers
router.route("/")
    .get(handleAllusers)
    .post(handleCreateUsers)

router
    .route("/:id")
    .get(getUserById)
    .patch(updateUserbyId)
    .delete(deleteUserById);
    
router.get("/list", handleListUsers);

module.exports = router;
