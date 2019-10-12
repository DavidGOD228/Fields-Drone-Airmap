class Vector {
  constructor(x, y) {
    this.setX(x);
    this.setY(y);
  }

  setX(value) {
    this._x = value;
  }

  setY(value) {
    this._y = value;
  }

  getX() {
    return this._x;
  }

  getY() {
    return this._y;
  }

  getLength() {
    return Math.sqrt(this._x * this._x + this._y * this._y);
  }

  setLength(length) {
    let angle = this.getAngle();
    this._x = length * Math.cos(angle);
    this._y = length * Math.sin(angle);
  }

  getAngle() {
    // console.log("this._y, this._x :", this._y, this._x);
    return Math.atan2(this._y, this._x);
  }

  getAngleFull() {
    // console.log("this._y, this._x :", this._y, this._x)
    let angle = Math.atan2(this._y, this._x);
    // angle = angle < 0 ? angle + 2 * Math.PI : angle;
    return angle;
  }

  distanceTo(v) {
    // let newv = new Vector(v._x - this._x, v._y - this._y)
    // let d= newv.getLength();
    // return new Vector(v._x - this._x, v._y - this._y).getLength();
    return new Vector(v._x - this._x, v._y - this._y).getLength();
  }

  setAngle(angle) {
    let length = this.getLength();
    this._x = length * Math.cos(angle);
    this._y = length * Math.sin(angle);
  }

  add(v2) {
    return new Vector(v2._x + this._x, v2._y + this._y);
  }

  subtract(v2) {
    return new Vector(v2._x - this._x, v2._y - this._y);
  }

  multiply(val) {
    return new Vector(this._x * val, this._y * val);
  }

  divide(val) {
    return new Vector(this._x / val, this._y / val);
  }

  addTo(v2) {
    this._x += v2._x;
    this._y += v2._y;
  }

  subtractFrom(v2) {
    this._x -= v2._x;
    this._y -= v2._y;
  }

  multiplyBy(val) {
    this._x *= val;
    this._y *= val;
  }

  divideBy(val) {
    this._x /= val;
    this._y /= val;
  }
}
export default Vector;
