'use strict';
const qr = require('qr-image');
const fs = require('fs');

// node qr "Enconde this string" "QRIMAGE.png"

// read the arguments

let dataToEnconde = process.argv[2] || null;
let outImage = process.argv[3] || null;

if(dataToEnconde !== null && outImage !== null) {
  qr.image(dataToEnconde, {
    type: 'png',
    size: 20
  }).pipe(fs.createWriteStream(outImage));

  console.log('QR Image Generated');
} else {
  console.log('Error, please check the arguments!!');
}
