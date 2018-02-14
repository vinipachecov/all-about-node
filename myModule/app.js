'use strict';

const enigma = require('./enigma');

const eng = new enigma('vinicius');

let encondeString = eng.encode('Don\'t Panic');
let decodeString = eng.decode(encondeString);

console.log("Encoded", encondeString);
console.log('Decoded', decodeString);

let qr = eng.qrgen("http://www.mpnjs.com", "outImage.png");

qr ? console.log('QR Code generated!') : console.log('QR Code faleid');;