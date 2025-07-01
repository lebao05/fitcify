const notFound = (req, res, next) => {
  res.status(404);
  next(new Error("Not found"));
};

const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    EM: err?.message,
    stack: err?.stack,
    ER: 1,
  });
};

module.exports = { notFound, errorHandler };