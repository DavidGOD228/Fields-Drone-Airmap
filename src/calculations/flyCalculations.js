export { MainCalculation };

class Point {
  constructor(xc, yc, zc) {
    this.x = xc;
    this.y = yc;
    this.z = zc || 0;
  }

  Add(that) {
    var temp = new Point(0, 0, 0);
    temp.x = this.x + that.x;
    temp.y = this.y + that.y;
    temp.z = this.z + that.z;
    return temp;
  }

  Sub(that) {
    var temp = new Point(0, 0, 0);
    temp.x = this.x - that.x;
    temp.y = this.y - that.y;
    temp.z = this.z - that.z;
    return temp;
  }

  Compare(that) {
    var temp = new Point(0, 0, 0);
    if (this.x === that.x && this.y === that.y && this.z === that.z) return 0;
    else return 1;
  }
}

class BaseCoords {
  constructor(a) {
    this.basecoords = a;
  }
}

class FieldCoords {
  constructor(A, B, C, D) {
    this.A = A;
    this.B = B;
    this.C = C;
    this.D = D;
  }
}

function distanceFromPoints(A, B) {
  var square = Math.sqrt(
    (A.x - B.x) * (A.x - B.x) +
      (A.y - B.y) * (A.y - B.y) +
      (A.z - B.z) * (A.z - B.z)
  );
  return square;
}

function FindNearestPoint(field, base) {
  var nearestPoint = new Point(0, 0, 0);
  var nearest = Math.min(
    Math.min(
      distanceFromPoints(base, field.A),
      distanceFromPoints(base, field.B)
    ),
    Math.min(
      distanceFromPoints(base, field.C),
      distanceFromPoints(base, field.D)
    )
  );
  nearest === distanceFromPoints(base, field.A)
    ? (nearestPoint = field.A)
    : nearest === distanceFromPoints(base, field.B)
    ? (nearestPoint = field.B)
    : nearest === distanceFromPoints(base, field.C)
    ? (nearestPoint = field.C)
    : (nearestPoint = field.D);
  return nearestPoint;
}

class HeliZone {
  constructor(centre, a, b) {
    a /= 2;
    b /= 2;
    this.Lu = new Point(0, 0, 0);
    this.Ru = new Point(0, 0, 0);
    this.Ld = new Point(0, 0, 0);
    this.Rd = new Point(0, 0, 0);

    this.Lu.x = centre.x - b;
    this.Lu.y = centre.y + a;

    this.Ru.x = centre.x + b;
    this.Ru.y = centre.y + a;

    this.Ld.x = centre.x - b;
    this.Ld.y = centre.y - a;

    this.Rd.x = centre.x + b;
    this.Rd.y = centre.y - a;
  }

  Init(centre, a, b) {
    a /= 2;
    b /= 2;
    this.Lu.x = centre.x - b;
    this.Lu.y = centre.y + a;

    this.Ru.x = centre.x + b;
    this.Ru.y = centre.y + a;

    this.Ld.x = centre.x - b;
    this.Ld.y = centre.y - a;

    this.Rd.x = centre.x + b;
    this.Rd.y = centre.y - a;
  }
}

class Heli {
  constructor(
    maxHeight,
    focus_distance,
    sensorA,
    sensorB,
    charge,
    flightCosts,
    photoCosts,
    base
  ) {
    //fields

    this.maxHeight = maxHeight;
    this.focus_distance = focus_distance;
    this.sensorA = sensorA;
    this.sensorB = sensorB;
    this.charge = charge;
    this.flightCosts = flightCosts;
    this.photoCosts = photoCosts;
    this.base = base;
    this.realCoords = base.basecoords;
    this.zone = new HeliZone(1, 1, 1);
    this.PointsArr = [];
  }

  //Methods()

  //<Dorobutu!!!>

  AddPoint() {
    this.PointsArr.push(this.realCoords);
    console.log(this.PointsArr);
  }

  optimalHeight(field) {
    var fa, fb, ha, hb;
    var tmpHeight = this.maxHeight;
    fa = distanceFromPoints(field.A, field.B); //field a
    fb = distanceFromPoints(field.B, field.C); //field b
    ha = (this.sensorA * tmpHeight) / this.focus_distance;
    hb = (this.sensorB * tmpHeight) / this.focus_distance;
    if ((fb > fa && hb < ha) || (fb < fa && hb > ha)) {
      this.Turn();
    }
    var minField = Math.min(fa, fb),
      maxField = Math.max(fa, fb),
      minHeliZone = Math.min(ha, hb),
      maxHeliZone = Math.max(ha, hb);
    if (maxHeliZone > maxField) {
      //if (minHeliZone > minField) { tmpHeight = minField * this.focus_distance / Math.min(this.sensorA, this.sensorB);}
      /*else {*/
      tmpHeight =
        (maxField * this.focus_distance) / Math.max(this.sensorA, this.sensorB); //}
      if (
        minField <
        (Math.min(this.sensorA, this.sensorB) * tmpHeight) / this.focus_distance
      ) {
        tmpHeight =
          (minField * this.focus_distance) /
          Math.min(this.sensorA, this.sensorB);
      }
    } else if (minHeliZone > minField) {
      tmpHeight =
        (minField * this.focus_distance) / Math.min(this.sensorA, this.sensorB);
    } else {
      tmpHeight = this.maxHeight;
    }
    return tmpHeight;
  }

  //</Dorobutu!!!>

  moveTo(To) {
    var distanse = distanceFromPoints(this.realCoords, To);
    this.charge -= distanse * this.flightCosts;
    this.realCoords = To;
    this.zone.Init(
      this.realCoords,
      (this.realCoords.z * this.sensorA) / this.focus_distance,
      (this.realCoords.z * this.sensorB) / this.focus_distance
    );
  }

  Turn() {
    this.zone.Init(
      this.realCoords,
      (this.realCoords.z * this.sensorB) / this.focus_distance,
      (this.realCoords.z * this.sensorA) / this.focus_distance
    );
    [this.sensorA, this.sensorB] = [this.sensorB, this.sensorA]
    // Math.swap(this.sensorA, this.sensorB);
  }

  startPos(field) {
    var finder = new Point(0, 0, 0);
    finder = FindNearestPoint(field, this.base.basecoords);
    if (finder.Compare(field.A)) {
      this.moveTo(
        new Point(
          field.A.x +
            (0.5 * this.sensorB * this.optimalHeight(field)) /
              this.focus_distance,
          field.A.y +
            (0.5 * this.sensorA * this.optimalHeight(field)) /
              this.focus_distance,
          this.optimalHeight(field)
        )
      );
    } else if (finder.Compare(field.B)) {
      this.moveTo(
        new Point(
          field.B.x +
            (0.5 * this.sensorB * this.optimalHeight(field)) /
              this.focus_distance,
          field.B.y -
            (0.5 * this.sensorA * this.optimalHeight(field)) /
              this.focus_distance,
          this.optimalHeight(field)
        )
      );
    } else if (finder.Compare(field.C)) {
      this.moveTo(
        new Point(
          field.C.x -
            (0.5 * this.sensorB * this.optimalHeight(field)) /
              this.focus_distance,
          field.C.y -
            (0.5 * this.sensorA * this.optimalHeight(field)) /
              this.focus_distance,
          this.optimalHeight(field)
        )
      );
    } else {
      this.moveTo(
        new Point(
          field.D.x -
            (0.5 * this.sensorB * this.optimalHeight(field)) /
              this.focus_distance,
          field.D.y +
            (0.5 * this.sensorA * this.optimalHeight(field)) /
              this.focus_distance,
          this.optimalHeight(field)
        )
      );
    }
  }

  Click() {
    this.charge -= this.photoCosts;
  }

  GoToBase() {
    this.moveTo(this.base.basecoords);
  }
}

function Logic(heli, field) {
  var NearestPoint = new Point(0, 0, 0);
  NearestPoint = FindNearestPoint(field, heli.base.basecoords);
  heli.startPos(field);
  var p1 = false,
    p2 = false;
  if (NearestPoint.Compare(field.A)) {
    while (true) {
      //<Рухаєсось вверх>
      heli.AddPoint();
      if (heli.zone.Rd.Compare(field.D)) {
        p1 = true;
      }
      while (heli.zone.Lu.y !== field.B.y) {
        //Перевіряємо, чи дрон не долетів до крайньої нижньої точки(D)
        if (heli.zone.Rd.Compare(field.D)) {
          p1 = true;
        }
        //Поки дрон не дойде до верхньої прямої
        if (field.B.y < heli.zone.Ru.y + heli.zone.Ru.y - heli.zone.Rd.y) {
          heli.moveTo(
            heli.realCoords.Add(new Point(0, field.B.y - heli.zone.Ru.y, 0))
          );
          heli.Click();
          heli.AddPoint();
        } else {
          heli.moveTo(
            heli.realCoords(new Point(0, heli.zone.Lu.y - heli.zone.Ld.y, 0))
          );
          heli.Click();
          heli.AddPoint();
        }
        //Перевіряємо, чи дрон не долетів до крайньої верхньої точки(C)
        if (heli.zone.Ru.Compare(field.C)) {
          p2 = true;
        }
      }
      if (heli.zone.Ru.Compare(field.C)) {
        p2 = true;
      }
      //</Рухаємось вверх>

      //Перевіряємо, чи не перетнув він дві крайні точки
      if (p1 === true && p2 === true) {
        break;
      }
      //<Рухаємось вправо>
      if (field.C.x <= heli.realCoords.x + heli.zone.Rd.x - heli.zone.Ld.x) {
        heli.moveTo(
          heli.realCoords.Add(new Point(field.C.x - heli.zone.Rd.x, 0, 0))
        );
        if (heli.zone.Rd.Compare(field.D)) {
          p1 = true;
        }
        if (heli.zone.Ru.Compare(field.C)) {
          p2 = true;
        }
      } else {
        heli.moveTo(
          heli.realCoords.Add(new Point(heli.zone.Rd.x - heli.zone.Ld.x, 0, 0))
        );
      }
      //</Рухаємось вправо>
      //<Рухаємось вниз>
      heli.AddPoint();

      if (heli.zone.Ru.Compare(field.C)) {
        p2 = true;
      }
      while (heli.zone.Ld.y !== field.A.y) {
        if (heli.zone.Ru.Compare(field.C)) {
          p2 = true;
        }

        if (field.A.y > heli.zone.Rd.y - heli.zone.Ru.y + heli.zone.Rd.y) {
          heli.moveTo(
            heli.realCoords.Sub(new Point(0, heli.zone.Rd.y - field.A.y, 0))
          );
          heli.Click();
          heli.AddPoint();
        } else {
          heli.moveTo(
            heli.realCoords.Sub(
              new Point(0, heli.zone.Lu.y - heli.zone.Ld.y, 0)
            )
          );
          heli.Click();
          heli.AddPoint();
        }

        if (heli.zone.Rd.Compare(field.D)) {
          p1 = true;
        }
      }
      //</Рухаємось вниз>
      if (heli.zone.Rd.Compare(field.D)) {
        p1 = true;
      }
      //Перевіряємо, чи не перетнув він дві крайні точки
      if (p1 === true && p2 === true) {
        break;
      }
      //<Рухаємось вправо>
      if (field.C.x <= heli.realCoords.x + heli.zone.Rd.x - heli.zone.Ld.x) {
        heli.moveTo(
          heli.realCoords.Add(new Point(field.C.x - heli.zone.Rd.x, 0, 0))
        );
        if (heli.zone.Rd.Compare(field.D)) {
          p1 = true;
        }
        if (heli.zone.Ru.Compare(field.C)) {
          p2 = true;
        }
      } else {
        heli.moveTo(
          heli.realCoords.Add(new Point(heli.zone.Rd.x - heli.zone.Ld.x, 0, 0))
        );
      }
      //</Рухаємось вправо>
    }
    heli.GoToBase();
  } else if (NearestPoint.Compare(field.B)) {
    while (true) {
      //<Рухаємось вниз>
      heli.AddPoint();
      if (heli.zone.Ru.Compare(field.C)) {
        p2 = true;
      }
      while (heli.zone.Ld.y !== field.A.y) {
        if (heli.zone.Ru.Compare(field.C)) {
          p2 = true;
        }

        if (field.A.y > heli.zone.Rd.y - heli.zone.Ru.y + heli.zone.Rd.y) {
          heli.moveTo(
            heli.realCoords.Sub(new Point(0, heli.zone.Rd.y - field.A.y, 0))
          );
          heli.Click();
          heli.AddPoint();
        } else {
          heli.moveTo(
            heli.realCoords.Sub(
              new Point(0, heli.zone.Lu.y - heli.zone.Ld.y, 0)
            )
          );
          heli.Click();
          heli.AddPoint();
        }

        if (heli.zone.Rd.Compare(field.D)) {
          p1 = true;
        }
      }
      //</Рухаємось вниз>
      if (heli.zone.Rd.Compare(field.D)) {
        p1 = true;
      }
      //Перевіряємо, чи не перетнув він дві крайні точки
      if (p1 === true && p2 === true) {
        break;
      }
      //<Рухаємось вправо>
      if (field.C.x <= heli.realCoords.x + heli.zone.Rd.x - heli.zone.Ld.x) {
        heli.moveTo(
          heli.realCoords.Add(new Point(field.C.x - heli.zone.Rd.x, 0, 0))
        );
        if (heli.zone.Rd.Compare(field.D)) {
          p1 = true;
        }
        if (heli.zone.Ru.Compare(field.C)) {
          p2 = true;
        }
      } else {
        heli.moveTo(
          heli.realCoords.Add(new Point(heli.zone.Rd.x - heli.zone.Ld.x, 0, 0))
        );
      }
      //</Рухаємось вправо>

      //<Рухаєсось вверх>
      heli.AddPoint();
      if (heli.zone.Rd.Compare(field.D)) {
        p1 = true;
      }
      while (heli.zone.Lu.y !== field.B.y) {
        //Перевіряємо, чи дрон не долетів до крайньої нижньої точки(D)
        if (heli.zone.Rd.Compare(field.D)) {
          p1 = true;
        }
        //Поки дрон не дойде до верхньої прямої
        if (field.B.y < heli.zone.Ru.y + heli.zone.Ru.y - heli.zone.Rd.y) {
          heli.moveTo(
            heli.realCoords.Add(new Point(0, field.B.y - heli.zone.Ru.y, 0))
          );
          heli.Click();
          heli.AddPoint();
        } else {
          heli.moveTo(
            heli.realCoords.Add(
              new Point(0, heli.zone.Lu.y - heli.zone.Ld.y, 0)
            )
          );
          heli.Click();
          heli.AddPoint();
        }
        //Перевіряємо, чи дрон не долетів до крайньої верхньої точки(C)
        if (heli.zone.RU.Compare(field.C)) {
          p2 = true;
        }
      }
      if (heli.zone.RU.Compare(field.C)) {
        p2 = true;
      }
      //</Рухаємось вверх>
      //Перевіряємо, чи не перетнув він дві крайні точки
      if (p1 === true && p2 === true) {
        break;
      }
      //<Рухаємось вправо>
      if (field.C.x <= heli.realCoords.x + heli.zone.Rd.x - heli.zone.Ld.x) {
        heli.moveTo(
          heli.realCoords.Add(new Point(field.C.x - heli.zone.Rd.x, 0, 0))
        );
        if (heli.zone.Rd.Compare(field.D)) {
          p1 = true;
        }
        if (heli.zone.RU.Compare(field.C)) {
          p2 = true;
        }
      } else {
        heli.moveTo(
          heli.realCoords.Add(new Point(heli.zone.Rd.x - heli.zone.Ld.x, 0, 0))
        );
      }
      //</Рухаємось вправо>
    }
    heli.GoToBase();
  } else if (NearestPoint.Compare(field.C)) {
    while (true) {
      //<Рухаємось вниз>
      heli.AddPoint();
      if (heli.zone.Lu.Compare(field.B)) {
        p2 = true;
      }
      while (heli.zone.Ld.y !== field.A.y) {
        if (heli.zone.Lu.Compare(field.B)) {
          p2 = true;
        }

        if (field.A.y > heli.zone.Rd.y - heli.zone.Ru.y + heli.zone.Rd.y) {
          heli.moveTo(
            heli.realCoords.Sub(new Point(0, heli.zone.Rd.y - field.A.y, 0))
          );
          heli.Click();
          heli.AddPoint();
        } else {
          heli.moveTo(
            heli.realCoords.Sub(
              new Point(0, heli.zone.Lu.y - heli.zone.Ld.y, 0)
            )
          );
          heli.Click();
          heli.AddPoint();
        }

        if (heli.zone.Ld.Compare(field.A)) {
          p1 = true;
        }
      }
      if (heli.zone.Ld.Compare(field.A)) {
        p1 = true;
      }
      //</Рухаємось вниз>
      //Перевіряємо, чи не перетнув він дві крайні точки
      if (p1 === true && p2 === true) {
        break;
      }

      //<Рухаємось вліво>
      if (field.B.x >= heli.realCoords.x - heli.zone.Rd.x + heli.zone.Ld.x) {
        heli.moveTo(
          heli.realCoords.Sub(new Point(heli.zone.Ld.x - field.B.x, 0, 0))
        );
        if (heli.zone.Ld.Compare(field.A)) {
          p1 = true;
        }
        if (heli.zone.Lu.Compare(field.B)) {
          p2 = true;
        }
      } else {
        heli.moveTo(
          heli.realCoords.Sub(new Point(heli.zone.Rd.x - heli.zone.Ld.x, 0, 0))
        );
      }
      //</Рухаємось вліво>

      //<Рухаєсось вверх>
      heli.AddPoint();
      if (heli.zone.Ld.Compare(field.A)) {
        p1 = true;
      }
      while (heli.zone.Lu.y !== field.B.y) {
        //Перевіряємо, чи дрон не долетів до крайньої нижньої точки(D)
        if (heli.zone.Ld.Compare(field.A)) {
          p1 = true;
        }
        //Поки дрон не дойде до верхньої прямої
        if (field.B.y < heli.zone.Ru.y + heli.zone.Ru.y - heli.zone.Rd.y) {
          heli.moveTo(
            heli.realCoords.Add(new Point(0, field.B.y - heli.zone.Ru.y, 0))
          );
          heli.Click();
          heli.AddPoint();
        } else {
          heli.moveTo(
            heli.realCoords.Add(
              new Point(0, heli.zone.Lu.y - heli.zone.Ld.y, 0)
            )
          );
          heli.Click();
          heli.AddPoint();
        }
        //Перевіряємо, чи дрон не долетів до крайньої верхньої точки(C)
        if (heli.zone.Lu.Compare(field.B)) {
          p2 = true;
        }
      }
      if (heli.zone.Lu.Compare(field.B)) {
        p2 = true;
      }
      //</Рухаємось вверх>

      //Перевіряємо, чи не перетнув він дві крайні точки
      if (p1 === true && p2 === true) {
        break;
      }

      //<Рухаємось вліво>
      if (field.B.x >= heli.realCoords.x - heli.zone.Rd.x + heli.zone.Ld.x) {
        heli.moveTo(
          heli.realCoords.Sub(new Point(heli.zone.Ld.x - field.B.x, 0, 0))
        );
        if (heli.zone.Ld.Compare(field.A)) {
          p1 = true;
        }
        if (heli.zone.Lu.Compare(field.B)) {
          p2 = true;
        }
      } else {
        heli.moveTo(
          heli.realCoords.Sub(new Point(heli.zone.Rd.x - heli.zone.Ld.x, 0, 0))
        );
      }
      //</Рухаємось вліво>
    }
    heli.GoToBase();
  } else {
    while (true) {
      //<Рухаєсось вверх>
      heli.AddPoint();
      if (heli.zone.Ld.Compare(field.A)) {
        p1 = true;
      }
      while (heli.zone.Lu.y !== field.B.y) {
        //Перевіряємо, чи дрон не долетів до крайньої нижньої точки(D)
        if (heli.zone.Ld.Compare(field.A)) {
          p1 = true;
        }
        //Поки дрон не дойде до верхньої прямої
        if (field.B.y < heli.zone.Ru.y + heli.zone.Ru.y - heli.zone.Rd.y) {
          heli.moveTo(
            heli.realCoords.Add(Point(0, field.B.y - heli.zone.Ru.y, 0))
          );
          heli.Click();
          heli.AddPoint();
        } else {
          heli.moveTo(
            heli.realCoords.Add(Point(0, heli.zone.Lu.y - heli.zone.Ld.y, 0))
          );
          heli.Click();
          heli.AddPoint();
        }
        //Перевіряємо, чи дрон не долетів до крайньої верхньої точки(C)
        if (heli.zone.Lu.Compare(field.B)) {
          p2 = true;
        }
      }
      if (heli.zone.Lu.Compare(field.B)) {
        p2 = true;
      }
      //</Рухаємось вверх>

      //Перевіряємо, чи не перетнув він дві крайні точки
      if (p1 === true && p2 === true) {
        break;
      }

      //<Рухаємось вліво>
      if (field.B.x >= heli.realCoords.x - heli.zone.Rd.x + heli.zone.Ld.x) {
        heli.moveTo(
          heli.realCoords.Sub(new Point(heli.zone.Ld.x - field.B.x, 0, 0))
        );
        if (heli.zone.Ld.Compare(field.A)) {
          p1 = true;
        }
        if (heli.zone.Lu.Compare(field.B)) {
          p2 = true;
        }
      } else {
        heli.moveTo(
          heli.realCoords.Sub(new Point(heli.zone.Rd.x - heli.zone.Ld.x, 0, 0))
        );
      }
      //</Рухаємось вліво>

      //<Рухаємось вниз>
      heli.AddPoint();
      if (heli.zone.Lu.Compare(field.B)) {
        p2 = true;
      }
      while (heli.zone.Ld.y !== field.A.y) {
        if (heli.zone.Lu.Compare(field.B)) {
          p2 = true;
        }

        if (field.A.y > heli.zone.Rd.y - heli.zone.Ru.y + heli.zone.Rd.y) {
          heli.moveTo(
            heli.realCoords.Sub(new Point(0, heli.zone.Rd.y - field.A.y, 0))
          );
          heli.Click();
          heli.AddPoint();
        } else {
          heli.moveTo(
            heli.realCoords.Sub(
              new Point(0, heli.zone.Lu.y - heli.zone.Ld.y, 0)
            )
          );
          heli.Click();
          heli.AddPoint();
        }

        if (heli.zone.Ld.Compare(field.A)) {
          p1 = true;
        }
      }
      if (heli.zone.Ld.Compare(field.A)) {
        p1 = true;
      }
      //</Рухаємось вниз>

      //Перевіряємо, чи не перетнув він дві крайні точки
      if (p1 === true && p2 === true) {
        break;
      }

      //<Рухаємось вліво>
      if (field.B.x >= heli.realCoords.x - heli.zone.Rd.x + heli.zone.Ld.x) {
        heli.moveTo(heli.realCoords - Point(heli.zone.Ld.x - field.B.x, 0, 0));
        if (heli.zone.Ld.Compare(field.A)) {
          p1 = true;
        }
        if (heli.zone.Lu.Compare(field.B)) {
          p2 = true;
        }
      } else {
        heli.moveTo(
          heli.realCoords.Sub(new Point(heli.zone.Rd.x - heli.zone.Ld.x, 0, 0))
        );
      }
      //</Рухаємось вліво>
    }
    heli.GoToBase();
  }
  console.log(heli);

  var json = JSON.stringify(heli);

  return json;
}

// baseX,
  // baseY,
  // BaseZ,
  // FieldAx,
  // FieldAy,
  // FieldBx,
  // FieldBy,
  // FieldCx,
  // FieldCy,
  // FieldDx,
  // FieldDy,
  // maxHeight,
  // focusDistance,
  // sensorA,
  // sensorB,
  // charge,
  // flightCosts,
  // photoCosts

function MainCalculation({
  field, base, drone
}) {
  // this.tr, this.tl, this.br, this.bl
  var bl = new Point(field.bounds.bl.lat, field.bounds.bl.lng);
  var tl = new Point(field.bounds.tl.lat, field.bounds.tl.lng);
  var tr = new Point(field.bounds.tr.lat, field.bounds.tr.lng);
  var br = new Point(field.bounds.br.lat, field.bounds.br.lng);

  var field = new FieldCoords(bl, tl, tr, br);
  var base = new BaseCoords(new Point(base.lat, base.lng, 1));

  var heli = new Heli(
    drone.maxHeight,
    drone.focusDistance,
    drone.sensorA,
    drone.sensorB,
    drone.charge,
    drone.flightCosts,
    drone.photoCosts,
    base
    );
  // console.log('base, field, heli :', base, field, heli);
  return Logic(heli, field);
}
