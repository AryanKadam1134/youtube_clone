class apiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong!",
    errors = [],
    stack = "",
    success
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.success = success;
    this.errors = errors;
  }
}

export default apiError;

// usecase
// apiError(400, "message")
