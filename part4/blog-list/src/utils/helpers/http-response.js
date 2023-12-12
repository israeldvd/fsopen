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

  static conflict(error) {
    return {
      code: 409,
      body: { error: error.message, params: [...error.resourceParams] },
    };
  }

  static created(body) {
    return {
      code: 201,
      body: body,
    };
  }
};
