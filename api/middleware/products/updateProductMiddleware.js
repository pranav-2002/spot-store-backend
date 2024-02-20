const { throwError } = require("../errors/errorhandler");
const Product = require("../../models/product/ProductModel");

const updateProductMiddleware = async (req, res, next) => {
  const userId = req.userId;
  const { productId } = req.params;

  try {
    const product = await Product.findOne({ _id: productId });

    if (product.owner_id.toString() !== userId) {
      return throwError(
        res,
        401,
        "Unauthorized Request (Invalid Product Owner)"
      );
    }
    next();
  } catch (error) {
    console.log(error);
    throwError(res, 500, "Internal Server Error");
  }
};

module.exports = updateProductMiddleware;
