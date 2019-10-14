import Rectangle from "./Rectangle.js";
import Vector from "./Vector.js";
import { vectorMapProxy, vectorToMap, getLngFactor } from "./helpers.js";
import Photo from "./Photo";

const Jimp = window.require('jimp');

class Field {
  // constructor({ polyArr, map, drawSquares = false, drawBounds = false }) {
  constructor(options) {
    
    for (let o of Object.entries(options)) {
      this[o[0]] = o[1];
    }
    this.drawSquares = options.drawSquares || false;
    this.drawBounds = options.drawBounds || false;
    this.photosMap = {};
    
    let minX = this.polyArr.reduce((acc, cur) => {
        return cur.lat < acc.lat ? cur : acc;
      }).lat,
      maxX = this.polyArr.reduce((acc, cur) => {
        return cur.lat > acc.lat ? cur : acc;
      }).lat,
      minY = this.polyArr.reduce((acc, cur) => {
        return cur.lng < acc.lng ? cur : acc;
      }).lng,
      maxY = this.polyArr.reduce((acc, cur) => {
        return cur.lng > acc.lng ? cur : acc;
      }).lng;

    let tl = vectorToMap(new Vector(minX, maxY)),
      tr = vectorToMap(new Vector(maxX, maxY)),
      bl = vectorToMap(new Vector(minX, minY)),
      br = vectorToMap(new Vector(maxX, minY));

    this.bounds = new Rectangle(tr, bl);

    console.log("this.bounds :", this.bounds);
    this.width = this.bounds.tr.lat - this.bounds.tl.lat;
    this.height = this.bounds.tr.lng - this.bounds.br.lng;

    if(this.drawBounds) {
      this.rectBounds = new window.google.maps.Rectangle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: this.map,
        bounds: {
          north: this.bounds.center.lat + this.bounds.xr,
          south: this.bounds.center.lat - this.bounds.xr,
          east:  this.bounds.center.lng + this.bounds.yr,
          west:  this.bounds.center.lng - this.bounds.yr
        }
      });
    }
  }

  setRadiuses(xr, yr) {
    this.squareXr = xr;
    this.squareYr = yr;
  }
// TODO: check if any point square point is inside tl tr bl br
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

  isRectInside(rect, drawMakers = false) {
    console.log('ISRECTINSDIE :');
    let points = rect.toArray();
    
    let isInside = points.reduce((acc, cur) => {
      if(drawMakers) {
        let mark = new window.google.maps.Marker({
          position: {
            lat: cur.lat,
            lng: cur.lng
          },
          map: this.map
        });
      }
      return this.isPointInside(acc) || this.isPointInside(cur);
    })
    // console.log('points :', points, isInside, [this.isPointInside(points[0]), this.isPointInside(points[1]), this.isPointInside(points[2]), this.isPointInside(points[3])]);

    console.log("INSIDE?: ", points.reduce((acc, cur) => {
      return this.isPointInside(acc) || this.isPointInside(cur);
    }))
    return isInside;
    
    // return this.isPointInside(rect.center);
  }

  // (async () => {
  //   let mapImg = await new Jimp(1200, 1200, 0x0);
  //   mapImg = await Photo.compositeImagesAndSave(mapImg, {
  //     src: "./Photos/Flight89/1.jpg",
  //     x: 400,
  //     y: 400
  //   }, "./output.jpg")
  // })();
  async composeWithMap (img) {
    this.photosMap.mapImg = await Photo.compositeImagesAndSave(this.photosMap.mapImg, img, this.photosMap.path)
  }

  async composeMap(images) {
    console.log('COMPOSE MAP :', images);
    this.photosMap.mapImg = await Photo.compositeImagesAndSave(this.photosMap, images, this.photosMap.path)
    return new Promise((resolve) => resolve())
  }

  async createMap() {
    console.log('this.photosMap.nYPixels :', this.photosMap.nYPixels);
    console.log('this.photosMap.nXPixels :', this.photosMap.nXPixels);
    
    this.photosMap.mapImg = await new Jimp(this.photosMap.nYPixels, this.photosMap.nXPixels, 0x0);
    this.photosMap.path = this.folderPath + "/output.jpg";
  }

  distributeOnSquares() {
    let nLatSquares = Math.floor(this.width / (this.squareXr * 1.9)),
        nLngSquares = Math.floor(this.height / (this.squareYr * 1.9))
      // nLngSquares = Math.ceil(this.height / ((this.squareRadius * 2) / getLngFactor(nLatSquares)));

    this.photosMap.nXPixels = nLatSquares * this.dronePhotoDimentions.x;
    this.photosMap.nYPixels = nLngSquares * this.dronePhotoDimentions.y;

    this.squaresArray = Array.from({ length: nLatSquares }, (el, x) =>
      Array.from(
        {
          length: nLngSquares
        },
        (ell, y) => {

          // let xr = (this.width / nLatSquares );
          // let yr = (this.height / nLngSquares) ;
          // let yr = xr;

          // console.log('xr, yr :', xr, yr);
          let bounds = Rectangle.newFromCenter({
                lat: this.bounds.tl.lat + (x / nLatSquares) * this.width,
                lng: this.bounds.bl.lng + (y / nLngSquares) * this.height
              }, this.squareXr, this.squareYr)

          if(this.drawSquares == true) {
            let coveredRect = new window.google.maps.Rectangle({
              strokeColor: "#FFFF00",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#00FF00",
              fillOpacity: 0.35,
              map: this.map,
              bounds: {
                north: bounds.center.lat + bounds.xr + this.squareXr,
                south: bounds.center.lat - bounds.xr + this.squareXr,
                east:  bounds.center.lng + bounds.yr + this.squareYr,
                west:  bounds.center.lng - bounds.yr + this.squareYr
              }
            });
          }

          return {
            visited: false,
            bounds
            // bounds: new Rectangle(this.bounds.tl.lat + ((x/nLatSquares) * this.width, this.bounds.tl.lng + ((y/nLngSquares) * this.height))
          };
        }
      )
    );
  }
}

export default Field;
