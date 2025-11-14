export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: 'Resource not found.' });
  next();
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Unexpected server error.';
  return res.status(statusCode).json({ message });
};
