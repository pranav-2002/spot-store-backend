const express = require("express");
const router = express.Router();
const userRouter = require("./users/UserRoutes");
const productRouter = require("./products/ProductRoutes");
const supportRouter = require("./support/SupportRoutes");

router.use("/user", userRouter);
router.use("/products", productRouter);
router.use("/support", supportRouter);

module.exports = router;
