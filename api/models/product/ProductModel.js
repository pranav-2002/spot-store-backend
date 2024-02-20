const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  primaryImage: {
    type: {
      imgUrl: String,
    },
    required: true,
  },
  images: {
    type: [
      {
        imgUrl: { type: String, required: true },
      },
    ],
    required: true,
  },
  sold: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
