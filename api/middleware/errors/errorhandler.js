const throwError = (res, statusCode, errorMessage) => {
  return res.status(statusCode).json({
    message: errorMessage,
  });
};

module.exports = { throwError };
