import Vector from "./Vector";

const fs = window.require('fs')

export const mapToVector = mapCoords => {
  return new Vector(mapCoords.lat, mapCoords.lng);
};

export const vectorToMap = v => {
  return {
    lat: v.getX(),
    lng: v.getY()
  };
};

export const vectorMapProxy = v => {
  Object.defineProperty(v, "lat", {
    get: function() {
      return this.getX();
    }
  });
  Object.defineProperty(v, "lng", {
    get: function() {
      return this.getY();
    }
  });
  return v;
};

export const directionEnum = {
  FIXED: 0,
  RIGHT: 1,
  LEFT: 2,
  UP: 3,
  DOWN: 4
};

export const numToDirection = num => {
  return Object.entries(directionEnum)[num][0];
};

export const getEnumDirection = angle => {
  if (angle > -Math.PI / 4 && angle < Math.PI / 4) {
    // return directionEnum.RIGHT;
    return directionEnum.UP;
  } else if (angle > Math.PI / 4 && angle < (3 * Math.PI) / 4) {
    // return directionEnum.UP;
    return directionEnum.RIGHT;
  } else if (angle > (3 * Math.PI) / 4 && angle < (5 * Math.PI) / 4) {
    // return directionEnum.LEFT;
    return directionEnum.DOWN;
  } else if (angle > (5 * Math.PI) / 4 && angle < (7 * Math.PI) / 4) {
    // return directionEnum.DOWN;
    return directionEnum.LEFT;
  }

  return directionEnum.LEFT;
  // return directionEnum.FIXED;
};

export const getDirectionLabel = angle => {
  return numToDirection(getEnumDirection(angle));
};

// export const getLngFactor = (lat) => Math.cos(lat * 0.01745)
export const getLngFactor = (lat) => Math.cos(lat * (Math.PI / 180))

export const base64_encode = (file) => {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  console.log('bitmap :', bitmap);
  let shit = new Buffer(bitmap).toString('base64');
  console.log('shit :', shit);
  return shit;
}