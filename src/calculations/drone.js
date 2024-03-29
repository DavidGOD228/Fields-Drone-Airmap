import Vector from "./Vector";
import Rectangle from "./Rectangle";
import {
  mapToVector,
  vectorToMap,
  vectorMapProxy,
  directionEnum,
  getEnumDirection,
  numToDirection,
  getDirectionLabel,
  base64_encode
} from "./helpers";
import { MainCalculation } from "../calculations/flyCalculations";

import Photo from "../calculations/Photo";

const fs = window.require("fs");

class Drone {
  constructor(options, window) {
    for (let o of Object.entries(options)) {
      this[o[0]] = o[1];
    }
    this.velocity = new Vector(0, 0);
    this.velocity.setLength(this.speed || 0);
    this.velocity.setAngle(this.direction || 0);
    this.secondsSpent = 0;
    this.currentHeight = 0;

    this.position = vectorMapProxy(mapToVector(this.position));

    this.targetMode = this.targetMode || false;
    this.path = this.path || [];
    this.composedPaths = this.composedPaths || [];
    this.currentComposedPathIdx = 0;
    this.coveredPath = [];
    this.currentTargetIdx = 0;
    this.currentSubflightIdx = 0;
    this.relativeCounter = 0;
    this.currentTarget = this.path[this.currentTargetIdx] || null;
    this.finishedFlight = false;
    this.photoBounds = Rectangle.newFromCenter(
      this.position,
      0.00268222365615145, // this.ovelayPhotoRadiusLat,
      0.00268222365615145 // this.ovelayPhotoRadiusLng
    );

    this.photos = [];
    this.photoMapObjs = [];

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
    switch (v.type) {
      case "MAKE_PHOTO":
        this.path.push({
          position: v.point,
          xn: v.xn,
          yn: v.yn,
          reached: false,
          type: v.type,
          reversed: v.reversed
        });
        break;
      case "BASE":
        this.path.push({
          position: v.point,
          reached: false,
          type: v.type
        });
        break;

      default:
        break;
    }
  }

  addComposedPath(pathArr) {
    this.composedPaths.push(pathArr);
  }

  distributeComposedPaths() {
    // this.composedPaths.map(cp => this.path.push(...cp));
    this.composedPaths.map(cp =>
      cp.map(el => {
        this.path.push({
          position: el.point,
          xn: el.xn,
          yn: el.yn,
          reached: false
        });
      })
    );
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

  getPhotoLink(
    point,
    settings = {
      size: `${this.dronePhotoDimentions.x}x${this.dronePhotoDimentions.y}`,
      zoom: 19,
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

  async update() {
    if (!this.started) {
      this.started = true;
      this.mapOffsetXStart = 0;
      if (this.savePhotos) {
        fs.closeSync(fs.openSync(this.folderPath + "/map.jpg", "w"));
      }

      this.flightInterval = setInterval(() => {
        this.batteryCharge -= this.batteryPerMove;
        this.updateDroneParameter("Заряд дрона", this.batteryCharge);
      }, 400);

      this.secondsSpentInterval = setInterval(() => {
        this.secondsSpent++;
        this.updateDroneParameter("Час польоту", this.secondsSpent);
      }, 1000);

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
          // SET NEW STATE
          this.currentTarget.reached = true;
          this.path[this.currentTargetIdx].reached = true;

          // MAKE A PHOTO
          if (this.path[this.currentTargetIdx].type === "MAKE_PHOTO") {
            let photoLink = this.getPhotoLink(
              // vectorMapProxy(this.path[this.currentTargetIdx].position)
              vectorMapProxy(this.currentTarget.position)
            );
            this.photos.push(photoLink);
            this.batteryCharge -= this.batteryPerPhoto;

            this.updateDroneParameter("Заряд дрона", this.batteryCharge);
            // SAVE FILE
            let filePath =
              this.folderPath +
              "/" +
              this.relativeCounter.toString().concat(".jpg");
            if (this.savePhotos) {
              Photo.downloadUrl(filePath, photoLink);
            }

            // let droneDir = getEnumDirection(this.velocity.getAngleFull());
            let photo = new Photo(
              { url: this.photos[this.photos.length - 1] },
              {
                x: this.currentTarget.xn * this.field.dronePhotoDimentions.x,
                y: this.currentTarget.yn * this.field.dronePhotoDimentions.y,
                src: filePath,
                reversed: this.currentTarget.reversed
              }
            );
            this.photoMapObjs.push(photo);
            this.pushPhoto(photo);

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
          }

          this.currentTargetIdx++;
          this.relativeCounter++;
          this.currentTarget = this.path[this.currentTargetIdx] || null;
        } else {
          this.velocity.setLength(0);
          this.finishedFlight = true;
          this.ended = true;

          clearInterval(this.flightInterval);
          clearInterval(this.secondsSpentInterval);

          console.log("this.photoMapObjs :", this.photoMapObjs);
          console.log("this.photos :", this.photos);
          this.field.composeMap(this.photoMapObjs).then(canvasImg => {
            // console.log("canvasImg :", canvasImg);
            this.setJimpMap(canvasImg);
            fs.readFile(this.field.photosMap.path, (err, data) => {
              let b64 = data.toString("base64");
              this.setMapPath(b64);
            });
            fs.readFile(this.field.photosMap.invertedMapPath, (err, data) => {
              console.log(
                "this.field.photosMap.invertedMapPath :",
                this.field.photosMap.invertedMapPath
              );
              let b64 = data.toString("base64");
              console.log("b64 :", b64);
              this.setInvertedPath(b64);
            });
          });
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
