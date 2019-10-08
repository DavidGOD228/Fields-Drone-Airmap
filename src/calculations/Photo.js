import sightengine from "sightengine";

let se = sightengine("540865617", "38b6kZYxVz6DyZLGv82G");
console.log("sightengine :", se);

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
  //       // Handle error
  //     });
  // }
}

export default Photo;
