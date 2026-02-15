const notFoundHandler = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Server error"
  });
};

module.exports = { notFoundHandler, errorHandler };
