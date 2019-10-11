import { CreateFile, DeleteFile, ReedFile, WriteFile } from '../start';
import sightengine from 'sightengine';
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

  static Create(dir, composition) {
    CreateFile(dir, composition);
  }

  static Reed(dir) {
    return ReedFile(dir);
  }

  static Write(dir, composition) {
    WriteFile(dir, composition);
  }

  static Delete(dir) {
    DeleteFile(dir);
  }
}

export default Photo;
