import Rectangle from "./Rectangle.js";

class Field {
  constructor({ bounds }) {
    this.bounds = new Rectangle(bounds.tr, bounds.bl)
    this.width = this.bounds.tr.lat - this.bounds.tl.lat;
    this.height = this.bounds.tr.lng - this.bounds.br.lng;
    console.log('width, height :', this.width, this.height);
  }

  setSquareRadius(r) {
    this.squareRadius = r;
  }

  distributeOnSquares() {
    let nWidth = Math.ceil(this.width / (this.squareRadius * 2)),
        nHeight = Math.ceil(this.height / (this.squareRadius * 2));

    console.log('nWidth, nHeight :', nWidth, nHeight);

    this.squaresArray = Array.from({ length: nWidth }, (el, i) => Array.from({
      length: nHeight
    }, (ell) => {
      return {
        visited: false
      }
    }))

    console.log('this.squaresArray :', this.squaresArray);
  }
}

export default Field;