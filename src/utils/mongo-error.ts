import {
  BadRequestError,
  ConflictError,
  CustomError,
  InternalServerError,
  NotFoundError,
} from '../errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleMongoDBError = (error: any, operation: string = 'operation') => {
  // Skip if it's already a custom error
  if (error instanceof CustomError) {
    throw error;
  }
  // Mongoose Validation Errors
  if (error.name === 'ValidationError') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validationErrors = Object.values(error.errors).map((err: any) => {
      if (err.kind === 'required') {
        return `Field '${err.path}' is required`;
      } else if (err.kind === 'enum') {
        return `Field '${err.path}' must be one of: ${
          err.enumValues?.join(', ') || 'valid values'
        }`;
      } else if (err.kind === 'min' || err.kind === 'max') {
        return `Field '${err.path}' ${err.message}`;
      } else if (err.kind === 'minlength' || err.kind === 'maxlength') {
        return `Field '${err.path}' ${err.message}`;
      } else if (err.kind === 'regexp') {
        return `Field '${err.path}' format is invalid`;
      }
      return err.message || `Field '${err.path}' is invalid`;
    });
    throw new BadRequestError(`Validation failed: ${validationErrors.join('; ')}`);
  }

  // Cast Errors (Invalid ObjectId, type casting failures)
  if (error.name === 'CastError') {
    const message =
      error.path === '_id'
        ? `Invalid ID format: '${error.value}'`
        : `Invalid value for field '${error.path}': '${error.value}'`;
    throw new BadRequestError(message);
  }

  // MongoDB Duplicate Key Errors (Unique constraint violations)
  if (error.name === 'MongoServerError' && error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    throw new ConflictError(`A record with ${field} '${value}' already exists`);
  }

  // Document Not Found (for findOneAndUpdate, findOneAndDelete with strict mode)
  if (error.name === 'DocumentNotFoundError') {
    throw new NotFoundError(`Resource not found for ${operation}`);
  }

  // Version Errors (Optimistic concurrency control)
  if (error.name === 'VersionError') {
    throw new ConflictError(
      `Document was modified by another process. Please retry the ${operation}`,
    );
  }

  // MongoDB Connection/Network Errors
  if (
    error.name === 'MongoNetworkError' ||
    error.name === 'MongoTimeoutError' ||
    error.code === 'ETIMEDOUT' ||
    error.code === 'ECONNREFUSED'
  ) {
    throw new InternalServerError('Database connection failed. Please try again later');
  }

  // MongoDB Server Errors
  if (error.name === 'MongoServerError') {
    // Write concern errors
    if (error.code === 100) {
      throw new InternalServerError('Database write operation failed');
    }
    // Transaction errors
    if (error.hasErrorLabel && error.hasErrorLabel('TransientTransactionError')) {
      throw new ConflictError('Transaction failed. Please retry the operation');
    }
  }

  // Mongoose Strict Mode Errors (unknown fields)
  if (error.name === 'StrictModeError') {
    throw new BadRequestError(`Unknown field in request: ${error.message}`);
  }

  // Mongoose OverwriteModel Error
  if (error.name === 'OverwriteModelError') {
    throw new InternalServerError('Model configuration error. Please contact support');
  }

  // Mongoose MissingSchema Error
  if (error.name === 'MissingSchemaError') {
    throw new InternalServerError('Schema configuration error. Please contact support');
  }

  // Fallback for unknown errors
  console.error(`Unhandled DB Error during ${operation}:`, error);
  throw new InternalServerError(`Database ${operation} failed. Please try again later`);
};
