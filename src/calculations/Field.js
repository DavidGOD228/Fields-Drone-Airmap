import Rectangle from "./Rectangle.js";
import Vector from "./Vector.js";
import { vectorMapProxy, vectorToMap } from "./helpers.js";

class Field {
  constructor({ polyArr }) {
    console.log("polyARRRRR :", polyArr);
    this.polyArr = polyArr;
    let minX = polyArr.reduce((acc, cur) => {
        return cur.lat < acc.lat ? cur : acc;
      }).lat,
      maxX = polyArr.reduce((acc, cur) => {
        return cur.lat > acc.lat ? cur : acc;
      }).lat,
      minY = polyArr.reduce((acc, cur) => {
        return cur.lng < acc.lng ? cur : acc;
      }).lng,
      maxY = polyArr.reduce((acc, cur) => {
        return cur.lng > acc.lng ? cur : acc;
      }).lng;

    console.log("minX, maxX, minY, maxY :", minX, maxX, minY, maxY);

    let tl = vectorToMap(new Vector(minX, maxY)),
      tr = vectorToMap(new Vector(maxX, maxY)),
      bl = vectorToMap(new Vector(minX, minY)),
      br = vectorToMap(new Vector(maxX, minY));

    this.bounds = new Rectangle(tr, bl);

    console.log("this.bounds :", this.bounds);
    this.width = this.bounds.tr.lat - this.bounds.tl.lat;
    this.height = this.bounds.tr.lng - this.bounds.br.lng;

    this.rectBounds = new window.google.maps.Rectangle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: this.map,
      // bounds: {
      //   north: this.bounds.tl.lat,
      //   south: this.bounds.bl.lat,
      //   east: this.bounds.tr.lng,
      //   west: this.bounds.tl.lng
      // }
      bounds: {
        north: this.bounds.center.lat + this.bounds.xr,
        south: this.bounds.center.lat - this.bounds.xr,
        east: this.bounds.center.lng + this.bounds.yr,
        west: this.bounds.center.lng - this.bounds.yr
      }
    });
  }

  setSquareRadius(r) {
    this.squareRadius = r;
  }

  isPointInside(p) {
    let vs = this.polyArr;

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i].lat,
        yi = vs[i].lng;
      var xj = vs[j].lat,
        yj = vs[j].lng;

      var intersect =
        yi > p.lng != yj > p.lng &&
        p.lat < ((xj - xi) * (p.lng - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  distributeOnSquares() {
    let nWidth = Math.ceil(this.width / (this.squareRadius * 2)),
      nHeight = Math.ceil(this.height / (this.squareRadius * 2));

    this.squaresArray = Array.from({ length: nWidth }, (el, x) =>
      Array.from(
        {
          length: nHeight
        },
        (ell, y) => {
          let xr = this.width / nWidth;
          let yr = this.height / nHeight;

          return {
            visited: false,
            bounds: Rectangle.newFromCenter(
              {
                lat: this.bounds.tl.lat + (x / nWidth) * this.width,
                lng: this.bounds.bl.lng + (y / nHeight) * this.height
              },
              xr,
              yr
            )
            // bounds: new Rectangle(this.bounds.tl.lat + ((x/nWidth) * this.width, this.bounds.tl.lng + ((y/nHeight) * this.height))
          };
        }
      )
    );
  }
}

export default Field;
