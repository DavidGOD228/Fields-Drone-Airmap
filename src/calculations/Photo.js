const Rembrandt = require("rembrandt/build/browser");
const mergeImg = window.require("merge-img");
const mergeImages = window.require("merge-images");
const Jimp = window.require("jimp");

const fs = window.require("fs");
const http = window.require("http");
const https = window.require("https");
const path = window.require("path");

const se = window.require("sightengine")("540865617", "38b6kZYxVz6DyZLGv82G");

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
    canvas.flip(false, true);
    canvas.invert();
    canvas.color([
      { apply: "red", params: [100] },
      { apply: "green", params: [-100] },
      { apply: "blue", params: [-100] }
    ]);
    canvas.brightness(-0.4);
    canvas.contrast(0.3);
  }

  static async compositeImagesAndSave(mainImg, imgs, outputPath) {
    let canvas = mainImg.mapImg;
    let jimps = [];

    // FIXME: -1 is not right
    for (let i = 0; i < imgs.length - 1; i++) {
      let j = await Jimp.read(imgs[i].src);
      jimps.push(j);
    }
    for (let [idx, j] of jimps.entries()) {
      canvas.composite(j, imgs[idx].x, imgs[idx].y);
    }
    //this.inverceColor(canvas);

    canvas.write(outputPath, () => console.log("DONE COMPOSING"));

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
    var tempA = filepathA;
    var tempB = filepathB;

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
}

// (async () => {
//   console.log("shit: ", await Photo.getFileBlurFactor("./4out.jpg"));
// })();

// Photo.getFileBlurFactor('./4out.jpg').then(res => console.log('res :', res));

export default Photo;
