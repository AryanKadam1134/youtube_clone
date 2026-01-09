class apiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong!",
    errors = [],
    success,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = statusCode < 400;
    this.data = null;
  }
}

export default apiError;

// usecase
// apiError(400, "message")
