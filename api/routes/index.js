const express = require("express");
const router = express.Router();
const userRouter = require("./users/UserRoutes");
const productRouter = require("./products/ProductRoutes");

router.use("/user", userRouter);
router.use("/products", productRouter);

module.exports = router;
