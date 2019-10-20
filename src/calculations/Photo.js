// const Rembrandt = require("rembrandt/build/browser");
import Rembrandt from "rembrandt";
const mergeImg = window.require("merge-img");
const mergeImages = window.require("merge-images");
const Jimp = window.require("jimp");
// const resemble = window.require("resemblejs");
const { compare } = require("resemblejs");
var looksSame = window.require("looks-same");

// const resemble = require("../start").resemble;
// console.log("compare :", resemble);
console.log("compare :", compare);

const fs = window.require("fs");
const http = window.require("http");
const https = window.require("https");
const path = window.require("path");
const util = window.require("util");

var exec = window.require("child_process").exec;

const se = window.require("sightengine")("540865617", "38b6kZYxVz6DyZLGv82G");

const execOperation = util.promisify(exec);

class Photo {
  constructor({ url }, additional) {
    if (additional) {
      for (let o of Object.entries(additional)) {
        this[o[0]] = o[1];
      }
    }

    this.url = url;
  }

  static downloadUrl(filename, url) {
    const file = fs.createWriteStream(filename);
    const request = https.get(url, function(response) {
      response.pipe(file);
    });
  }

  static async blurUrl(url, outputFilepath, blurFactor = 20) {
    const image = await Jimp.read(url);

    image
      .blur(blurFactor, function(err) {
        if (err) throw err;
      })
      .write(outputFilepath);
  }

  static async compositeImages(canvas, img) {
    let j = await Jimp.read(img.src);
    canvas.composite(j, img.x, img.y);
    return canvas;
  }

  static async uploadIMG(filepathA) {
    var url;
    var file = fs.readFileSync(filepathA);
    var base64 = new Buffer(file).toString("base64");
    console.log(file, base64);
    fetch(
      "https://api.imgbb.com/" +
        file.filename +
        "/" +
        base64 +
        "?key=06706fe2cc8c18bdcce5f4424f86a038"
    )
      .then(res => res.json())
      .then(
        result => {
          console.log(result);
        },
        error => {
          console.log(error);
        }
      );
    return url;
  }

  static async inverceColor(canvas) {
    canvas.invert();
    canvas.color([
      { apply: "red", params: [100] },
      { apply: "green", params: [-100] },
      { apply: "blue", params: [-100] }
    ]);
    canvas.brightness(-0.4);
    canvas.contrast(0.3);

    return canvas;
  }

  static async compositeImagesAndSave(
    mainImg,
    imgs,
    outputPath,
    invertedMapPath
  ) {
    let canvas = mainImg.mapImg;
    let jimps = [];

    for (let i = 0; i < imgs.length; i++) {
      let j = await Jimp.read(imgs[i].src);
      jimps.push(j);
    }
    for (let [idx, j] of jimps.entries()) {
      let y = mainImg.nXPixels - imgs[idx].y - mainImg.yDimention;
      if (imgs[idx].reversed) {
        console.log(
          "mainImg.nXPixels - imgs[idx].x, mainImg.nXPixels, imgs[idx].x :",
          mainImg.nYPixels - imgs[idx].x,
          mainImg.nYPixels,
          imgs[idx].x
        );
        canvas.composite(j, mainImg.nYPixels - imgs[idx].x, y);
      } else {
        canvas.composite(j, imgs[idx].x, y);
      }
    }

    canvas.write(outputPath, () => console.log("DONE COMPOSING"));
    let inverted = await Photo.inverceColor(canvas);
    inverted.write(invertedMapPath, () => console.log("DONE COMPOSING"));
    // console.log("canvas :", canvas);
    return canvas;
  }

  static blur(inputFilepath, outputFilepath, blurFactor = 20) {
    Jimp.read(inputFilepath)
      .then(file => {
        return file.blur(blurFactor).write(outputFilepath); // save
      })
      .catch(err => {
        console.error(err);
      });
  }

  static async comparingImages(filepathA, filepathB) {
    var tempA = fs.readFileSync(filepathA);
    var tempB = fs.readFileSync(filepathB);

    console.log("tempA, tempB :", tempA, tempB);
    const rembrandt = new Rembrandt({
      imageA: tempA,
      imageB: tempB,
      thresholdType: Rembrandt.THRESHOLD_PERCENT,
      maxThreshold: 0.01,
      maxDelta: 20,
      maxOffset: 15,
      renderComposition: true, // Should Rembrandt render a composition image?
      compositionMaskColor: Rembrandt.Color.RED // Color of unmatched pixels
    });
    console.log("rembrandt :", rembrandt);
    // console.log("rembrandt.compare() :", rembrandt.compare());
    rembrandt
      .compare()
      .then(result => {
        console.log("Passed:", result.passed);
        console.log("Difference:", (result.threshold * 100).toFixed(2), "%");
        console.log("Composition image buffer:", result.compositionImage);
      })
      .catch(err => {
        console.error(err);
      });
  }

  static getFileBlurFactor(filepath) {
    return se
      .check(["properties"])
      .set_file(filepath)
      .then(function(result) {
        return result.sharpness;
      })
      .catch(function(err) {
        console.log("err :", err);
      });
  }

  static uploadPhoto(path) {
    return execOperation(`imgur ${path}`).then((one, two, three) => {
      return one.stdout;
    });
  }

  // static resembleCompare(path1, path2) {
  //   resemble.outputSettings({
  //     largeImageThreshold: 0
  //   });
  //   var diff = resemble(path1)
  //     .compareTo(path2)
  //     .ignoreColors()
  //     .onComplete(data => {
  //       console.log(data);
  //       // var png = data.getDiffImage();
  //       // var buf = new Buffer([]);
  //       // var strm = png.pack();
  //       // strm.on("data", function(dat) {
  //       //   buf = Buffer.concat([buf, dat]);
  //       // });
  //       // strm.on("end", function() {
  //       //   fs.writeFile("diff.png", buf, null, function(err) {
  //       //     if (err) {
  //       //       throw "error writing file: " + err;
  //       //     }
  //       //     console.log("file written");
  //       //   });
  //       // });
  //       // res.render('compare');
  //     });
  // }
  static comparePixelMatch(
    path1,
    path2,
    comparePath,
    { tolerance, antialiasingTolerance, ignoreAntialiasing, ignoreCaret }
  ) {
    looksSame.createDiff(
      {
        reference: path1,
        current: path2,
        diff: comparePath,
        highlightColor: "#ff00ff", // color to highlight the differences
        strict: false, // strict comparsion
        tolerance: tolerance || 10,
        antialiasingTolerance: antialiasingTolerance || 0,
        ignoreAntialiasing: ignoreAntialiasing || true, // ignore antialising by default
        ignoreCaret: ignoreCaret || true // ignore caret by default
      },
      error => {}
    );
  }
}

// Photo.comparePixelMatch(
//   "./Photos/Flight20/4.jpg",
//   "./Photos/Flight20/2.jpg",
//   "./Photos/Flight20/shit.jpg"
// );

// Photo.comparingImages("./Photos/Flight20/4.jpg", "./Photos/Flight20/4.jpg");
// Photo.resembleCompare("./Photos/Flight20/4.jpg", "./Photos/Flight20/4.jpg");

// function getDiff(image1, image2) {
//   const options = {
//     returnEarlyThreshold: 5
//   };

//   compare(image1, image2, options, function(err, data) {
//     if (err) {
//       console.log("An error!");
//     } else {
//       console.log(data);
//     }
//   });
// }

// getDiff("./Photos/Flight20/4.jpg", "./Photos/Flight20/4.jpg");

// looksSame(
//   "./Photos/Flight20/4.jpg",
//   "./Photos/Flight20/3.jpg",
//   (error, { equal }) => {
//     console.log("equal :", equal);
//     // equal will be true, if images looks the same
//   }
// );

(async () => {
  let val = await Photo.uploadPhoto("./Photos/Flight20/4.jpg");
  console.log("val :", val);
  // Photo.comparingImages(val, val);
  // Photo.comparingImages("./Photos/Flight20/4.jpg", "./Photos/Flight20/4.jpg");
})();

// Photo.compareImages("./Photos/Flight20/4.jpg", "./Photos/Flight20/4.jpg");

export default Photo;
