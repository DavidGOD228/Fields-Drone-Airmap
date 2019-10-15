import sightengine from 'sightengine';
const mergeImg = window.require('merge-img');
const mergeImages = window.require('merge-images');

const Jimp = window.require('jimp');

const fs = window.require('fs');
const http = window.require('http');
const https = window.require('https');
const path = window.require('path');
import Rembrandt from 'rembrandt';

// console.log('mergeImages :', mergeImages);
// console.log('mergeImg :', mergeImg);

// downloadUrlToFile("Second_PHOTO.jpg", "http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg");

// console.log("fs :", fs);
let se = sightengine('540865617', '38b6kZYxVz6DyZLGv82G');
console.log('se :', se);

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

  // blurBase64(url) {
  //   return Jimp.read(this.url, (err, lenna) => {
  //     if (err) throw err;
  //     lenna.blur(100).getBase64(Jimp.MIME_JPEG); // save
  //   });
  // }

  // async static blur() {
  static async blurUrl(url, outputFilepath, blurFactor = 20) {
    // const image = await Jimp.read
    const image = await Jimp.read(url);
    console.log('image :', image);

    image
      .blur(blurFactor, function(err) {
        if (err) throw err;
      })
      .write(outputFilepath);
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

  static getFileBlurFactor(filepath) {
    console.log('file blur');
    var i64 = new Buffer(fs.readFileSync(filepath)).toString('base64');

    var Result;
    sightengine
      .check(['type', 'properties'])
      .set_bytes(i64, 'image.png')
      .then(function(result) {
        Result = result;
        console.log('file blur detecter');
      })
      .catch(function(err) {
        console.log('file blur detect ERROR ', err);
      });

    return Result;
  }
  static async getUrlBlur(url) {
    return await sightengine
      .check(['properties'])
      .set_url(url)
      .then(function(result) {
        console.log('RESULT IMAGE :', result);
      })
      .catch(function(err) {
        // Handl e error
      });
  }

  static getDiff(image1, image2) {
    const rembrandt = new Rembrandt({
      // `imageA` and `imageB` can be either Strings (file path on node.js,
      // public url on Browsers) or Buffers
      imageA: image1,
      imageB: image2,

      // Needs to be one of Rembrandt.THRESHOLD_PERCENT or Rembrandt.THRESHOLD_PIXELS
      thresholdType: Rembrandt.THRESHOLD_PERCENT,

      // The maximum threshold (0...1 for THRESHOLD_PERCENT, pixel count for THRESHOLD_PIXELS
      maxThreshold: 0.01,

      // Maximum color delta (0...255):
      maxDelta: 20,

      // Maximum surrounding pixel offset
      maxOffset: 0,

      renderComposition: true, // Should Rembrandt render a composition image?
      compositionMaskColor: Rembrandt.Color.RED // Color of unmatched pixels
    });

    // Run the comparison
    var difference;
    rembrandt
      .compare()
      .then(function(result) {
        console.log('Passed:', result.passed);
        console.log('Percentage Difference', result.percentageDifference, '%');
        console.log('Composition image buffer:', result.compositionImage);

        // Note that `compositionImage` is an Image when Rembrandt.js is run in the browser environment
      })
      .catch(e => {
        console.error(e);
      });
    return difference;
  }

  // static async compositeImages(images, outputPath) {
  //   var jimps = [];

  //   for(let imgUrl of images) {
  //     let j = await Jimp.read(imgUrl);
  //     jimps.push(j);
  //   }
  //   console.log('jimps :', jimps);

  //   var mainImage = await new Jimp(1200, 1200, 0x0);

  //   mainImage.composite(jimps[0], 0, 0);
  //   mainImage.composite(jimps[1], 400, 400);
  //   mainImage.composite(jimps[2], 800, 800);
  //   mainImage.write(outputPath, () => console.log('DONE COMPOSING'))
  // }

  static async compositeImages(canvas, img) {
    console.log('CALLED CI');
    let j = await Jimp.read(img.src);
    canvas.composite(j, img.x, img.y);
    return canvas;
  }

  // static async compositeImagesAndSave(canvas, img, outputPath) {
  //   console.log("CALLED CIAS");
  //   // console.log('img.src :', img.src);
  //   // let j = await Jimp.read(img.src);
  //   console.log('img.src :', "./Photos/Flight89/1.jpg");
  //   let j = await Jimp.read("./Photos/Flight89/1.jpg");
  //   console.log('canvas, j :', canvas, j);
  //   canvas.composite(j, img.x, img.y);
  //   canvas.write(outputPath, () => console.log('DONE COMPOSING'))
  //   return canvas;
  // }
  static async inverceColor(canvas) {
    canvas.flip(false, true);
    canvas.invert();
    canvas.color([
      { apply: 'red', params: [100] },
      { apply: 'green', params: [-100] },
      { apply: 'blue', params: [-100] }
    ]);
    canvas.brightness(-0.4);
    canvas.contrast(0.3);
  }
  static async compositeImagesAndSave(mainImg, imgs, outputPath) {
    console.log('CALLED CIAS');
    // console.log('img.src :', img.src);
    // let j = await Jimp.read(img.src);
    // console.log('img.src :', "./Photos/Flight89/1.jpg");
    let canvas = mainImg.mapImg;
    let jimps = [];

    // canvas.contain(mainImg.nYPixels, mainImg.nXPixels, 0, Jimp.HORIZONTAL_ALIGN_LEFT | Jimp.VERTICAL_ALIGN_BOTTOM);
    // FIXME: -1 is not right
    for (let i = 0; i < imgs.length - 1; i++) {
      let j = await Jimp.read(imgs[i].src);
      // console.log('idx, j :',i, j);
      jimps.push(j);
    }
    // for(let [idx,img] of imgs.entries()) {
    //   let j = await Jimp.read(img.src);
    //   console.log('idx, j :',idx, j);
    //   jimps.push(j)
    // }

    // console.log('jimps, imgs :', jimps, imgs);
    for (let [idx, j] of jimps.entries()) {
      canvas.composite(j, imgs[idx].x, imgs[idx].y);
    }

    // let j = await Jimp.read("./Photos/Flight89/1.jpg");
    // console.log('canvas, j :', canvas, j);
    // canvas.composite(j, img.x, img.y);

    // this.getDiff(
    //   'C:/Users/dtrum/Desktop/c83b33ca-b9ff-49ea-834b-28432a0b6dc2.jpg',
    //   'C:/Users/dtrum/Desktop/c83b33ca-b9ff-49ea-834b-28432a0b6dc2.jpg'
    // );
    //this.inverceColor(canvas);

    canvas.write(outputPath, () => console.log('DONE COMPOSING'));
    console.log(this.getFileBlurFactor('C:/Users/dtrum/Desktop/image.png'));
    return canvas;
  }
}

// (async () => {
//   let mapImg = await new Jimp(1200, 1200, 0x0);
//   console.log('mapImg :', mapImg);
//   mapImg = await Photo.compositeImagesAndSave(mapImg, {
//     src: "./Photos/Flight89/1.jpg",
//     x: 400,
//     y: 400
//   }, "./output.jpg")
//   console.log('mapImg :', mapImg);
// })();

// Photo.compositeImages(
//   [
//     "./Photos/Flight85/1.jpg",
//     "./Photos/Flight85/30.jpg",
//     "./Photos/Flight85/31.jpg",
//     // "./75.jpg",
//     // "./76.jpg"
//   ],
//   // "./Photos/Flight85/output.jpg"
//   "./output.jpg"
// )

// Photo.blurUrl('https://images.unsplash.com/photo-1531804055935-76f44d7c3621?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80', "BlurKek.jpg");
// Photo.blur("./Photos/Flight29/0.jpg", "./0.jpg", 20)
// Photo.getFileBlurFactor('./0.jpg')
// Photo.getUrlBlurFactor().then(res => console.log("url sharpness: ", res.sharpness));
// Photo.getFileBlurFactor("./Photos/Flight29/0.jpg")
// console.log("sd");
// Photo.getFileBlurFactor("0.jpg")

// var binaryImage = fs.createReadStream(path.resolve(__dirname,'0.jpg'));

// se.check(['nudity', 'type', 'properties','wad','faces', 'celebrities']).set_bytes(binaryImage).then(function(result) {
//   // The result of the API
//   console.log('result :', result);
// }).catch(function(err) {
//   // Error
// });
// .then(res => console.log("url sharpness: ", res.sharpness));

// Photo.downloadUrl("ThIRD_PHOTO.jpg", "http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg")

export default Photo;
