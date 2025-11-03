class ApiResponse {
  constructor(statusCode, data, message = "Request processed successfully") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode<400;
  }
}
