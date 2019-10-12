import sightengine from "sightengine";
// import mergeImg from "merge-img";
// import Jimp from "jimp/es";

// const fs = require("fs");
// const http = require("http");
// import http from "http";
// import fs from "fs";
// var app = require("remote").require("app");
// var app = require("remote").require("app");

// var file = fs.createWriteStream(app.getDataPath() + "externalFiles/file.jpg");
// var request = http.get("http://url-to-api/some-image.jpg", function(response) {
//   response.pipe(file);
// });

// console.log("fs :", fs);
let se = sightengine("540865617", "38b6kZYxVz6DyZLGv82G");
console.log("sightengine :", se);

class Photo {
  constructor({ url }, additional) {
    if (additional) {
      for (let o of Object.entries(additional)) {
        this[o[0]] = o[1];
      }
    }

    this.url = url;
  }

  static merge() {
    // mergeImg(["image-1.png", "image-2.jpg"]).then(img => {
    //   // Save image as file
    //   img.write("out.png", () => console.log("done"));
    // });
  }

  static downloadUrl(url, fileName) {
    // console.log("fs :", fs);
    // const file = fs.createWriteStream(fileName);
    // const request = http.get(url, function(response) {
    //   response.pipe(file);
    // });
  }

  blurBase64() {
    // return Jimp.read(this.url, (err, lenna) => {
    //   if (err) throw err;
    //   lenna.blur(100).getBase64(Jimp.MIME_JPEG); // save
    // });
  }

  // static async getUrlBlur(url) {
  //   return await sightengine
  //     .check(["properties"])
  //     .set_url(
  //       "https://sightengine.com/assets/img/examples/example-prop-c1.jpg"
  //     )
  //     .then(function(result) {
  //       console.log("RESULT IMAGE :", result);
  //     })
  //     .catch(function(err) {
  //       // Handle error
  //     });
  // }
}

export default Photo;
