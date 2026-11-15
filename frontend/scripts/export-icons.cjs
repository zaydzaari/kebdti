const fs=require('node:fs');
const sharp=require('sharp');
const mark=fs.readFileSync('public/brand/kebdti-mark.svg','utf8');
const inner=mark.replace(/<svg[^>]*>|<\/svg>/g,'');
const icon=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="-10 -10 84 84"><rect x="-10" y="-10" width="84" height="84" rx="18" fill="#faf8f5"/>${inner}</svg>`);
Promise.all([
  sharp(icon).resize(512).png().toFile('public/brand/kebdti-icon-512.png'),
  sharp(icon).resize(180).png().toFile('public/brand/kebdti-icon-180.png'),
  sharp('public/brand/kebdti-logo.svg').resize(1008).png().toFile('public/brand/kebdti-logo-preview.png'),
  sharp(Buffer.from(mark)).resize(32).png().toBuffer().then(png=>{const h=Buffer.alloc(22);h.writeUInt16LE(1,2);h.writeUInt16LE(1,4);h[6]=32;h[7]=32;h.writeUInt16LE(1,10);h.writeUInt16LE(32,12);h.writeUInt32LE(png.length,14);h.writeUInt32LE(22,18);fs.writeFileSync('public/favicon.ico',Buffer.concat([h,png]));}),
]).then(()=>{fs.writeFileSync('public/favicon.svg',mark);console.log('Padded app icons, favicon and portable wordmark exported');});
