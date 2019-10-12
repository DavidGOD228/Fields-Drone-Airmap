import sightengine from "sightengine";

const mergeImg = window.require('merge-img');
const jimp = window.require('jimp');
const fs = window.require('fs');
const http = window.require('http');
const https = window.require('https')

// console.log('mergeImg :', mergeImg);

// downloadUrlToFile("Second_PHOTO.jpg", "http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg");

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

  static mergeTwo(path, name1, name2) {
    const filename1 = path + "/" + name1, 
          filename2 = path + "/" + name2;
    mergeImg([filename1, filename2])
      .then((img) => {
      img.write(path + '/outmap.jpg', () => console.log('done'));
    });
  }

  static merge() {
    const path = "./Photos/Flight29/";
    mergeImg([path + "outmap1.jpg", path + "outmap.jpg"], {
      direction: true
    })
      .then((img) => {
      img.write(path + '/outmap1.jpg', () => console.log('done'));
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
    // fs.readFile(inputFilepath, function(err, file) {
    //   if (err) throw err; // Fail if the file can't be read.
    
    //   const image = URL.createObjectURL(new Blob([file], {type: "image/jpg"})); 

    //   image.blur(blurFactor, function(err){ 
    //     if (err) throw err; 
    //   }).write(outputFilepath);   
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

// Photo.merge();
Photo.blurUrl('https://images.unsplash.com/photo-1531804055935-76f44d7c3621?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80', "BlurKek.jpg");
// Photo.blur("./Photos/Flight29/0.jpg", "./0.jpg", 20)

// Photo.downloadUrl("ThIRD_PHOTO.jpg", "http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg")

export default Photo;
