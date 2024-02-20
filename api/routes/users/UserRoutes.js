const express = require("express");
const userRouter = express.Router();
const userController = require("../../controllers/users/UserController");
const {
  authMiddleware,
} = require("../../middleware/authorization/authorization");

userRouter.post("/auth/sign-up", userController.userSignUp);
userRouter.get("/auth/verify/:id", userController.userVerify);
userRouter.post("/auth/sign-in", userController.userSignIn);
userRouter.get("/products", authMiddleware, userController.getProductsByUser);

module.exports = userRouter;
