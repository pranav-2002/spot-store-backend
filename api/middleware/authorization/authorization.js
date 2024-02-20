const jwt = require("jsonwebtoken");
const config = require("../../../config/server");
const { throwError } = require("../errors/errorhandler");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, config.jwt_password);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    throwError(res, 401, "Unauthorized Request (Invalid JWT)");
  }
};

module.exports = { authMiddleware };
