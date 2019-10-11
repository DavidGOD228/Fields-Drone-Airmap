var http = require("http");
var fs = require("fs");

console.log("FILE SHIT WORKS");

function downloadUrl(url, fileName) {
  console.log("fs :", fs);
  const file = fs.createWriteStream(fileName);
  const request = http.get(url, function(response) {
    response.pipe(file);
  });
}

// downloadUrl
