module.exports = class ConflictError extends Error {
  constructor(resource, params) {
    super(`Conflict in resource ${resource}`);
    this.name = "ConflictError";
    this.resourceParams = Array.isArray(params) ? params : [];
  }
};
