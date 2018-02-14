
'use strict';
const crypto = require('crypto');
const qr = require('qr-image');
const fs = require('fs');

module.exports = function(key) {
  // so the key is available for all functions
  this.key = key;
  return {
   encode: (str) => {
     let encoder = crypto.createCipher('aes-256-ctr', this.key);
     return encoder.update(str, 'utf8', 'hex');

   },
   decode: (str) => {
      let decoder = crypto.createDecipher('aes-256-ctr', this.key);
      return decoder.update(str, 'hex', 'utf8');
   },
   qrgen: (data, file) => {
     let dataToEncode = data || null;
     let outIMage = file || null;
     if (dataToEncode !== null  && outIMage !== null) {
       qr.image(dataToEncode, {
         type: 'png',
         size: 20
       }).pipe(fs.createWriteStream(outIMage));
       return true;
     } else {
       return false;
     }
   }
  }
};

// exports.hello = (user) => {
//   return "Hello" + user ;
// }