const config = require("../../../config/server");
const User = require("../../models/users/UserModel");
const z = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verificationEmailRequest = require("../../routes/users/ElasticEmailApi");
const Product = require("../../models/product/ProductModel");
const { throwError } = require("../../middleware/errors/errorhandler");

// New User Registration
const userSignUp = async (req, res) => {
  const signUpBodyValidator = z.object({
    email: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string(),
    registrationNumber: z.string(),
  });

  const { success } = signUpBodyValidator.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "Bad Request (Please check your payload)",
    });
  }

  const {
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    registrationNumber,
  } = req.body;

  // This variable is used to delete the record in case of any elastic email errors
  let userId = null;

  try {
    // Checking if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email id already exists",
      });
    }

    // Hashing the users password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Saving the new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      registrationNumber,
    });
    userId = newUser._id;

    // Email Verification start
    const verificationToken = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
      },
      config.jwt_password,
      { expiresIn: "7d" }
    );

    const emailRequest = await verificationEmailRequest(
      newUser.email,
      newUser.firstName,
      verificationToken
    );
    // Email Verification end

    return res.status(200).json({
      message: "Sign Up Successful. Please verify your email",
      userId: newUser._id,
      email: newUser.email,
    });
  } catch (error) {
    console.log(error);
    await User.deleteOne({ _id: userId });
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// User email verification
const userVerify = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(422).json({
      message: "Token is missing",
    });
  }

  try {
    const payload = jwt.verify(id, config.jwt_password);

    if (!payload) {
      return res.status(500).json({
        message: "Invalid JWT Token",
      });
    }

    const updateVerification = await User.findOneAndUpdate(
      { _id: payload.userId },
      { isVerified: true }
    );

    return res.send(`
      <h2>Your Email has been verified</h2>
      <h5>Please Login Using the below link</h5>
      <p> <a href="https://spot-store.netlify.app/login">Spot Store Login</a></p>
    `);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// User Sign In
const userSignIn = async (req, res) => {
  const signInBody = z.object({
    email: z.string(),
    password: z.string(),
  });
  const { success } = signInBody.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "Bad request",
    });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(510).json({
        message: "This email id has not been registered",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Email not verified",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      config.jwt_password,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login Successful",
      token: `Bearer ${token}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get all Products of a User
const getProductsByUser = async (req, res) => {
  const userId = req.userId;
  try {
    const allProducts = await Product.find({ owner_id: userId });
    return res.status(200).json({
      message: "Fetched all products of this user",
      products: allProducts,
    });
  } catch (error) {
    return throwError(res, 500, "Internal Server Error");
  }
};

// Get details of a particular user
const getUserData = async (req, res) => {
  const userId = req.userId;
  try {
    const userDetails = await User.findById(userId);
    return res.status(200).json({
      message: "Fetched User Details",
      user: {
        _id: userDetails._id,
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        registrationNumber: userDetails.registrationNumber,
        phoneNumber: userDetails.phoneNumber,
      },
    });
  } catch (error) {
    console.log(error);
    return throwError(res, 500, "Internal Server Error");
  }
};

// Modify User Details
const editUserData = async (req, res) => {
  const editUserBody = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string(),
    password: z.string().optional(),
  });

  const { success } = editUserBody.safeParse(req.body);

  if (!success) {
    return throwError(res, "400", "Bad request (Incorrect Payload)");
  }

  const userId = req.userId;
  const { firstName, lastName, phoneNumber, password } = req.body;

  let hashedPassword = undefined;

  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  try {
    const modifiedUser = await User.findOneAndUpdate(
      { _id: userId },
      { firstName, lastName, phoneNumber, password: hashedPassword }
    );
    return res.status(200).json({
      message: "Changed User Details Successfully",
      userId: modifiedUser._id,
    });
  } catch (error) {
    console.log(error);
    return throwError(res, 500, "Internal Server Error");
  }
};

// Get user details by id
const getUserById = async (req, res) => {
  const id = req.params.id;

  if (!id || id === "undefined") {
    return throwError(res, "400", "Bad request (Incorrect Payload)");
  }

  try {
    const user = await User.findById(id);
    return res.status(200).json({
      message: "Fetched user details",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return throwError(res, 500, "Internal Server Error");
  }
};

// Forgot Password
const forgotPassword = (req, res) => {
  const forgotPasswordBody = z.object({
    email: z.string(),
  });

  try {
  } catch (error) {}
};

module.exports = {
  userSignUp,
  userVerify,
  userSignIn,
  getProductsByUser,
  getUserData,
  editUserData,
  getUserById,
};
