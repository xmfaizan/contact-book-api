// Global error handling middleware

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error to console in development
  if (process.env.NODE_ENV !== "production") {
    console.error("API Error:", err);
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Invalid ID format";
    error = {
      message,
      statusCode: 400,
    };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = {
      message,
      statusCode: 400,
    };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = {
      message,
      statusCode: 400,
    };
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

// 404 Not Found middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
