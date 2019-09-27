var Vector = {
  _x: 1,
  _y: 0,

  create: function (x, y) {
    let obj = Object.create(this);
    obj.setX(x);
    obj.setY(y);
    return obj;
  },

  setX: function (value) {
    this._x = value;
  },

  setY: function (value) {
    this._y =  value;
  },

  getX: function () {
    return this._x
  },

  getY: function () {
    return this._y
  },

  getLength: function () {
    return Math.sqrt(this._x * this._x + this._y * this._y);
  },

  setLength: function (length) {
    let angle = this.getAngle();
    this._x = length * Math.cos(angle);
    this._y = length * Math.sin(angle);
  },

  getAngle: function () {
    return Math.atan2(this._y, this._x);
  },

  setAngle: function (angle) {
    let length = this.getLength();
    this._x = length * Math.cos(angle);
    this._y = length * Math.sin(angle);
  },

  add: function (v2) {
    return vector.create(v2._x + this._x, v2._y + this._y);
  },

  subtract: function (v2) {
    return vector.create(v2._x - this._x, v2._y - this._y);
  },

  multiply: function (val) {
    return vector.create(this._x * val, this._y * val);
  },

  divide: function (val) {
    return vector.create(this._x / val, this._y / val);
  },

  addTo: function (v2) {
    this._x += v2._x;
    this._y += v2._y;
  },

  subtractFrom: function (v2) {
    this._x -= v2._x;
    this._y -= v2._y;
  },

  multiplyBy: function (val) {
    this._x *= val;
    this._y *= val;
  },

  divideBy: function (val) {
    this._x /= val;
    this._y /= val;
  },

}