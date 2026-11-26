const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - Endpoint [${req.method}] ${req.originalUrl} does not exist.`
  });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Safe logging without credentials/secrets
  console.error(`[API Error] ${req.method} ${req.originalUrl} ->`, err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = {
  notFound,
  errorHandler
};
