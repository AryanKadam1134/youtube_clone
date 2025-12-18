class apiRes {
  constructor(statusCode, data, message = "success", success) {
    this.statusCode = statusCode;
    this.data = data;
    this.success = statusCode > 400;
  }
}

export default apiRes;
