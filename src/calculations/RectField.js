import Rectangle from "./Rectangle.js";

class RectField {
  constructor({ bounds }) {
    this.bounds = new Rectangle(bounds.tr, bounds.bl)
    this.width = this.bounds.tr.lat - this.bounds.tl.lat;
    this.height = this.bounds.tr.lng - this.bounds.br.lng;
  }

  setSquareRadius(r) {
    this.squareRadius = r;
  }

  distributeOnSquares() {
    let nWidth = Math.ceil(this.width / (this.squareRadius * 2)),
        nHeight = Math.ceil(this.height / (this.squareRadius * 2));

    this.squaresArray = Array.from({ length: nWidth }, (el, x) => Array.from({
      length: nHeight
    }, (ell, y) => {
      let xr = (this.width / nWidth);
      let yr = (this.height / nHeight);

      return {
        visited: false,
        bounds: Rectangle.newFromCenter({
          lat: this.bounds.tl.lat + (((x/nWidth) * this.width) ),
          lng: this.bounds.bl.lng + (((y/nHeight) * this.height) )
        }, xr, yr)
        // bounds: new Rectangle(this.bounds.tl.lat + ((x/nWidth) * this.width, this.bounds.tl.lng + ((y/nHeight) * this.height))
      }
    }))
  }
}


export default RectField;
