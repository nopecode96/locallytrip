const errorHandler = (error, req, res, next) => {
  

  // Sequelize validation errors
  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(err => ({
      field: err.path,
      message: err.message
    }));
    
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  // Sequelize unique constraint errors
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Duplicate entry',
      message: 'A record with this value already exists'
    });
  }

  // Sequelize foreign key constraint errors
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Invalid reference',
      message: 'Referenced record does not exist'
    });
  }

  // Default server error
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    message: 'An unexpected error occurred'
  });
};

module.exports = errorHandler;
