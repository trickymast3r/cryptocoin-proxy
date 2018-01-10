class Class {
  static getInstance(...args) {
    if (!(this._singleton instanceof this)) {
      this._singleton = new this(...args);
    }
    return this._singleton;
  }
}
module.exports = Class
