const AppError = require("../utils/AppError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const { name } = err.keyValue;
  // const value = err.errmsg.match(/"([^"]*)"/);
  // console.log(value);
  const message = `Duplicate field value: ${name}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  console.log("val error handle here");
  const errors = Object.values(err.errors).map((val) => val.message);
  const message = `Invalid input data ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  else {
    console.error("ERROR🔥", err);
    res.status(500).json({
      status: "error",
      message: "something went very wrong!",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    // console.log(error._message, "thrown by me");
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    // if (error.errors.name === "ValidationError")
    //   error = handleValidationErrorDB(error);

    if (error._message === "Validation failed")
      error = handleValidationErrorDB(error);
    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
