module.exports = class HttpResponse {
  static ok(body) {
    return {
      code: 200,
      body: body,
    };
  }

  static badRequest(error) {
    return {
      code: 400,
      body: { error: error.message },
    };
  }
};
