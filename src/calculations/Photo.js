import sightengine from "sightengine";

const mergeImg = window.require('merge-img');
const jimp = window.require('jimp');

const fs = window.require('fs');
const http = window.require('http');
const https = window.require('https')
const path = window.require('path')

// console.log('mergeImg :', mergeImg);

// downloadUrlToFile("Second_PHOTO.jpg", "http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg");

// console.log("fs :", fs);
let se = sightengine("540865617", "38b6kZYxVz6DyZLGv82G");
console.log("se :", se);


class Photo {
  constructor({ url }, additional) {
    if (additional) {
      for (let o of Object.entries(additional)) {
        this[o[0]] = o[1];
      }
    }

    this.url = url;
  }

  static mergeTwo(path, name1, name2) {
    const filename1 = path + "/" + name1, 
          filename2 = path + "/" + name2;
    mergeImg([filename1, filename2])
      .then((img) => {
      img.write(path + '/outmap.jpg', () => console.log('done'));
    });
  }
  static merge(photo1, photo2, outputPath) {
    const path = "./Photos/Flight29/";
    mergeImg([photo1, photo2], {
      direction: true
    })
      .then((img) => {
      img.write(outputPath + '/outmap1.jpg', () => console.log('done'));
    });
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
    // const image = await jimp.read 
    const image = await jimp.read(url); 
    console.log('image :', image);

    image.blur(blurFactor, function(err){ 
      if (err) throw err; 
    }).write(outputFilepath);   
  }

  static blur(inputFilepath, outputFilepath, blurFactor = 20) {
    jimp.read(inputFilepath)
      .then(file => {
        return file
          .blur(blurFactor)
          .write(outputFilepath); // save
      })
      .catch(err => {
        console.error(err);
      });
  }


  static getFileBlurFactor(filepath) {
    console.log("file blur");
    return  se
      .check(['properties'])
      .set_file(filepath)
      .then(function(result) {
        console.log('FILE BLUR :', result);
      }).catch(function(err) {
        // Error
      });
  }

  // static getFileBlurFactor(filepath) {
  //   console.log("file blur");
  //   return  se
  //     .check(['properties'])
  //     .set_file(filepath)
  //     .then(function(result) {
  //       console.log('FILE BLUR :', result);
  //     }).catch(function(err) {
  //       // Error
  //     });
  // }
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
  //       // Handl e error
  //     });
  // }

  
}

// Photo.merge();
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
