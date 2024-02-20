require("dotenv").config();

const server_port = process.env.PORT || 3000;

const mongoDB_url = process.env.MONGO_URL;

const jwt_password = process.env.JWT_PASSWORD;

const email = process.env.EMAIL_USERNAME;

const password = process.env.EMAIL_PASSWORD;

const elasticEmailApiKey = process.env.ELASTIC_EMAIL_API_KEY;

const elasticEmailMailId = process.env.EMAIL_USERNAME;

module.exports = {
  server_port,
  mongoDB_url,
  jwt_password,
  email,
  password,
  elasticEmailApiKey,
  elasticEmailMailId,
};
