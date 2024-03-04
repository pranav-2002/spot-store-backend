const express = require("express");
const productRouter = express.Router();
const {
  authMiddleware,
} = require("../../middleware/authorization/authorization");
const updateProductMiddleware = require("../../middleware/products/updateProductMiddleware");
const productController = require("../../controllers/products/ProductController");

productRouter.get("/all", productController.getAllProducts);
productRouter.post("/create", authMiddleware, productController.createProduct);
productRouter.patch(
  "/update/:productId",
  authMiddleware,
  updateProductMiddleware,
  productController.updateProduct
);
productRouter.delete(
  "/delete/:productId",
  authMiddleware,
  updateProductMiddleware,
  productController.deleteProduct
);
productRouter.get("/:productId", productController.getProductById);
productRouter.patch(
  "/sold",
  authMiddleware,
  productController.changeProductToSold
);
productRouter.get(
  "/category/:categoryName",
  productController.getProductByCategory
);

module.exports = productRouter;
