import Vector from "./Vector";

export const mapToVector = (mapCoords) => {
  return new Vector(mapCoords.lat, mapCoords.lng);
}

export const vectorToMap = (v) => {
  return {
    lat: v.getX(),
    lng: v.getY()
  };
}

export const vectorMapProxy = (v) => {
  Object.defineProperty(v, 'lat', { get: function() { return this.getX(); } });
  Object.defineProperty(v, 'lng', { get: function() { return this.getY(); } });
  return v;
}

// export const create2dimentionalArray = (r, c) => {
//   let arr = new Array(r);

//   for (var i = 0; i < x.length; i++) {
//     x[i] = new Array(c);
//   }
// }