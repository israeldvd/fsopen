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

  static unauthorized(error) {
    return {
      code: 401,
      body: { error: error.message },
    };
  }

  static forbidden(error) {
    return {
      code: 403,
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
