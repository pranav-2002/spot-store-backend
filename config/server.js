require("dotenv").config();

const server_port = process.env.PORT || 3000;

const mongoDB_url = process.env.MONGO_URL;

const jwt_password = process.env.JWT_PASSWORD;

const email = process.env.EMAIL_USERNAME;

const password = process.env.EMAIL_PASSWORD;

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;

const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

module.exports = {
  server_port,
  mongoDB_url,
  jwt_password,
  email,
  password,
  accessKeyId,
  secretAccessKey,
};
