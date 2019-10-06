import Vector from './Vector';

class Rectangle {
  constructor(tr, bl) {
    [this.tr, this.bl] = [tr, bl]
    this.tl = {
      lat: this.bl.lat,
      lng: this.tr.lng
    }
    this.br = {
      lat: this.tr.lat,
      lng: this.bl.lng
    }
    this.xr = (this.tr.lat - this.tl.lat) / 2;
    this.yr = (this.tr.lng - this.br.lng) / 2;
    this.center = {
      lat: this.tl.lat + this.xr,
      lng: this.tl.lng - this.yr
    } 
  }

  static newFromCenter(center, xr, yr) {
    yr = yr || xr; // in case only 1 radius is passed

    // this.tl = center.add(new Vector(-rx, ry));

    // let tr = center.add(new Vector(xr, yr));
    // let bl = center.add(new Vector(-xr, -yr));
    let tr = {
      lat: center.lat + xr,
      lng: center.lng + yr
    }, bl = {
      lat: center.lat - xr,
      lng: center.lng - yr
    }
    
    // this.br = center.add(new Vector(rx, -ry));

    return new Rectangle(tr, bl);
  }

  toArray() {
    return [this.tr, this.tl, this.br, this.bl]
  }
}

export default Rectangle;