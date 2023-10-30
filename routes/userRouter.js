const express = require("express")
const {registerUser, loginUser, getAllUsers, getAUser, updateUser, deleteUser} = require("../controller/user.controller");
const {authMiddleware ,isAdmin} = require("../middleware/authMiddleware");

const userRouter = express.Router();

// post route register a user
userRouter.post("/register", registerUser)
//post route for login user
userRouter.post("/login", loginUser)

//All get routes
userRouter.get("/all-users",isAdmin, getAllUsers);
userRouter.get("/:id", authMiddleware, getAUser);
//userRouter.get("/:id", isAdmin, getAUser);


// all put routes
userRouter.put("/update-profile", authMiddleware, updateUser);

// all delete routes
userRouter.get("/:id", authMiddleware, isAdmin, deleteUser)

module.exports = userRouter