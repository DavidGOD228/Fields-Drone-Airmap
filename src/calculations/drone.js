import Vector from "./Vector";
import {
  mapToVector,
  vectorToMap,
  vectorMapProxy,
  directionEnum,
  getEnumDirection,
  numToDirection,
  getDirectionLabel
} from "./helpers";
import { MainCalculation } from "../calculations/flyCalculations";
import Photo from "../calculations/Photo";

class Drone {
  constructor(options, window) {
    for (let o of Object.entries(options)) {
      this[o[0]] = o[1];
    }
    this.velocity = new Vector(0, 0);
    this.velocity.setLength(this.speed || 0);
    this.velocity.setAngle(this.direction || 0);

    this.position = vectorMapProxy(mapToVector(this.position));

    this.targetMode = this.targetMode || false;
    this.path = this.path || [];
    this.coveredPath = [];
    this.currentTargetIdx = 0;
    this.currentTarget = this.path[this.currentTargetIdx] || null;
    this.finishedFlight = false;

    this.photos = [];

    this.started = false;
    this.ended = false;

    this.window = window;
    this.marker = new window.google.maps.Marker(options);
    this.fieldOverlay = new window.google.maps.Rectangle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: this.map,
      bounds: {
        north: this.position.lat + this.overlayRadiusLat,
        south: this.position.lat - this.overlayRadiusLat,
        east: this.position.lng + this.overlayRadiusLng,
        west: this.position.lng - this.overlayRadiusLng
      }
    });
  }

  addToPath(v) {
    this.path.push({
      position: v,
      reached: false
    });
  }

  angleTo(other) {
    return Math.atan2(
      other.getY() - this.position.getY(),
      other.getX() - this.position.getX()
    );
  }

  getDistance(other) {
    let dx = other.position.getX() - this.position.getX();
    let dy = other.position.getY() - this.position.getY();
    return Math.sqrt(dx * dx + dy * dy);
  }

  markCurrentTarget() {
    let m = new window.google.maps.Marker({
      position: {
        lat: this.currentTarget.getX(),
        lng: this.currentTarget.getY()
      },
      map: this.map
    });
  }

  setField(field) {
    this.field = field;
  }

  setBase(base) {
    this.base = base;
  }

  mapToCenter(p) {
    let pos = this.position;
    if (p.getX() > pos.getX() && p.getY() > pos.getY()) {
      return p.add(new Vector(this.overlayRadiusLat, this.overlayRadiusLng));
    } else if (p.getX() > pos.getX() && p.getY() < pos.getY()) {
      return p.add(new Vector(this.overlayRadiusLat, -this.overlayRadiusLng));
    } else if (p.getX() < pos.getX() && p.getY() > pos.getY()) {
      return p.add(new Vector(-this.overlayRadiusLat, this.overlayRadiusLng));
    } else if (p.getX() < pos.getX() && p.getY() < pos.getY()) {
      return p.add(new Vector(-this.overlayRadiusLat, -this.overlayRadiusLng));
    }
  }

  findPath() {}

  makePhoto(
    point,
    settings = {
      size: "400x400",
      zoom: 18,
      maptype: "satellite",
      key: "AIzaSyBkDqO4ZFc9wLSfg-6qHo5xdAGusxTsRyI"
    }
  ) {
    const base = "https://maps.googleapis.com/maps/api/staticmap";
    let link;

    settings.center = point.lat + "," + point.lng;
    link = this.mashLink(base, settings);

    return link;
  }

  mashLink(base, params) {
    const ps = Object.entries(params);
    let res = base;

    for (let i = 0; i < ps.length; i++) {
      res += i === 0 ? "?" : "&";
      res += ps[i][0] + "=" + ps[i][1];
    }

    return res;
  }

  update() {
    if (!this.started) {
      this.started = true;
      this.startCallback();
    }

    if (this.targetMode) {
      // let pVector = vectorMapProxy(mapToVector(p));
      if (!this.currentTarget && this.currentTargetIdx < this.path.length) {
        this.currentTarget = this.path[this.currentTargetIdx];
      }

      var d = this.currentTarget
        ? this.position.distanceTo(this.currentTarget.position)
        : -Infinity;

      if (d <= this.velocity.getLength()) {
        if (this.currentTargetIdx < this.path.length) {
          this.currentTarget.reached = true;
          this.path[this.currentTargetIdx].reached = true;

          this.photos.push(
            this.makePhoto(
              vectorMapProxy(this.path[this.currentTargetIdx].position)
            )
          );

          console.log(
            "val, label :",
            getEnumDirection(this.velocity.getAngleFull()),
            getDirectionLabel(this.velocity.getAngleFull())
          );

          let droneDir = getEnumDirection(this.velocity.getAngleFull());
          let photo = new Photo(
            { url: this.photos[this.photos.length - 1] },
            { droneDir }
          );
          this.pushPhoto(photo);
          Photo.downloadUrl(photo.url, photo.url);

          let coveredRect = new window.google.maps.Rectangle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 0,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map: this.map,
            bounds: {
              north: this.position.lat + this.overlayRadiusLat,
              south: this.position.lat - this.overlayRadiusLat,
              east: this.position.lng + this.overlayRadiusLng,
              west: this.position.lng - this.overlayRadiusLng
            }
          });

          this.coveredPath.push(coveredRect);

          this.currentTargetIdx++;
          this.currentTarget = this.path[this.currentTargetIdx] || null;
        } else {
          this.velocity.setLength(0);
          this.finishedFlight = true;
          console.log("this.photos :", this.photos);
          this.ended = true;
          this.endCallback();
        }
      }
      if (this.currentTarget) {
        this.velocity.setAngle(this.angleTo(this.currentTarget.position));
      }
    }

    this.position.addTo(this.velocity);
    this.marker.setPosition(
      new this.window.google.maps.LatLng(this.position.lat, this.position.lng)
    );

    this.fieldOverlay.setOptions({
      bounds: {
        north: this.position.lat + this.overlayRadiusLat,
        south: this.position.lat - this.overlayRadiusLat,
        east: this.position.lng + this.overlayRadiusLng,
        west: this.position.lng - this.overlayRadiusLng
      }
    });
  }

  findClosestPoint(ps) {
    let closestP = Infinity;
    let closestD = Infinity;
    for (let p of ps) {
      let pVector = vectorMapProxy(mapToVector(p));
      let d = this.position.distanceTo(pVector);
      if (d < closestD) {
        closestD = d;
        closestP = pVector;
      }
    }
    return closestP;
  }
}

export default Drone;
