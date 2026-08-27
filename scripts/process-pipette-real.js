const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const dir = path.join("public", "images", "pipette");
const src = path.join(dir, "real-collage.jpg"); // vertical 1400x5641, three 1400x1867 panels

const tileH = 1867;
const gap = 20;
const panels = [0, tileH + gap, (tileH + gap) * 2];

(async () => {
  for (let i = 0; i < panels.length; i++) {
    const buf = await sharp(src)
      .extract({ left: 0, top: panels[i], width: 1400, height: tileH })
      .resize({ width: 1800, height: 2400, fit: "cover", position: "centre" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    const dest = path.join(dir, `real-${i + 1}.jpg`);
    fs.writeFileSync(dest, buf);
    console.log(dest, buf.length);
  }
  fs.rmSync(src, { force: true });
})();
