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
  }
}

export default Rectangle;