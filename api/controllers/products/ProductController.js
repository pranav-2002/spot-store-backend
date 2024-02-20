const Product = require("../../models/product/ProductModel");
const { throwError } = require("../../middleware/errors/errorhandler");
const z = require("zod");

// Get all created Products
const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({});
    return res.status(200).json({
      message: "All Products fetched",
      products: allProducts,
    });
  } catch (error) {
    console.log(error);
    return throwError(res, 500, "Internal Server Error");
  }
};

// Create a new Product
const createProduct = async (req, res) => {
  const createProductBody = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    primaryImage: z.object({
      imgUrl: z.string(),
    }),
    images: z
      .object({
        imgUrl: z.string(),
      })
      .array()
      .nonempty()
      .max(4),
  });

  const { success } = createProductBody.safeParse(req.body);

  if (!success) {
    return throwError(res, 400, "Bad Request (Invalid Payload)");
  }

  const { title, description, price, primaryImage, images } = req.body;

  try {
    const newProduct = await Product.create({
      title,
      description,
      price,
      primaryImage,
      images,
      owner_id: req.userId,
    });
    return res.status(200).json({
      message: "product created successfully",
      product_id: newProduct._id,
    });
  } catch (error) {
    console.log(error);
    return throwError(res, 500, "Internal Server Error");
  }
};

// Update Product information
const updateProduct = async (req, res) => {
  const updateProductBody = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    primaryImage: z.object({
      imgUrl: z.string(),
    }),
    images: z
      .object({
        imgUrl: z.string(),
      })
      .array()
      .nonempty()
      .max(4),
  });

  const { success } = updateProductBody.safeParse(req.body);

  if (!success) {
    return throwError(res, 400, "Bad Request (Check Payload)");
  }

  const { productId } = req.params;

  const { title, description, price, primaryImage, images } = req.body;

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      { title, description, price, primaryImage, images }
    );
    return res.status(200).json({
      message: "Product Updated Successfully",
      product_id: updatedProduct._id,
    });
  } catch (error) {
    console.log(error);
    return throwError(res, 500, "Internal Server Error");
  }
};

// Deleting a Product
const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const deletedProduct = await Product.deleteOne({ _id: productId });
    return res.status(200).json({
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    return throwError(res, 500, "Internal Server Error");
  }
};

// Get product by Id
const getProductById = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    return res.status(200).json({
      message: "Fetched Product Details",
      product: product,
    });
  } catch (error) {
    console.log(error);
    return throwError(res, "500", "Internal Server Error");
  }
};

// Change Product to Sold
const changeProductToSold = async (req, res) => {
  const productSoldBody = z.object({
    productId: z.string(),
  });
  const { success } = productSoldBody.safeParse(req.body);

  if (!success) {
    return throwError(res, 400, "Bad Request (Invalid Payload)");
  }

  const { productId } = req.body;

  try {
    const productSold = await Product.findOneAndUpdate(
      { _id: productId },
      { sold: true }
    );
    return res.status(200).json({
      message: "Product updated to sold",
      productId: productSold._id,
    });
  } catch (error) {
    console.log(error);
    return throwError(res, 500, "Internal Server Error");
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  changeProductToSold,
};
