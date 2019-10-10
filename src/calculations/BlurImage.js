import Jimp from 'jimp/es';

export function BlurBase64(dir) {
  return Jimp.read(dir, (err, lenna) => {
    if (err) throw err;
    lenna.blur(100).getBase64(Jimp.MIME_JPEG); // save
  });
}
