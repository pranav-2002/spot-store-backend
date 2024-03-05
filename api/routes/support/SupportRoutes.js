const express = require("express");
const supportRouter = express.Router();
const SupportController = require("../../controllers/support/SupportController");

supportRouter.post("/contact", SupportController.contactSupport);

module.exports = supportRouter;
