import sightengine from 'sightengine';
import FileSaver from 'file-saver';
let se = sightengine('540865617', '38b6kZYxVz6DyZLGv82G');
console.log('sightengine :', se);

class Photo {
  constructor({ url }, additional) {}

  // async static getBlur(url) {
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

  static saveURL(url, ImgDir) {
    FileSaver.saveAs(url, ImgDir);
  }
  static saveOBJ(file, ImgDir) {
    var file = new File(file, ImgDir, { type: 'img' });
    FileSaver.saveAs(file);
  }
}

export default Photo;
