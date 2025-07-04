const notFound = (req, res, next) => {
  res.status(404);
  next(new Error("Not found"));
};

const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    Message: err?.message,
    Stack: err?.stack,
    Error: 1,
  });
};

module.exports = { notFound, errorHandler };