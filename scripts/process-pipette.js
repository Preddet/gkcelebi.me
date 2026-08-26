const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const dir = path.join("public", "images", "pipette");
const files = [
  "backside.jpg",
  "front-profile.jpg",
  "inside.jpg",
  "multi-12.jpg",
  "multi-6.jpg",
  "shifted-inside.jpg",
  "side-profile.jpg",
];

(async () => {
  for (const f of files) {
    const p = path.join(dir, f);
    const buf = await sharp(p)
      .rotate()
      .resize({ width: 1800, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    const tmp = p + ".tmp";
    fs.writeFileSync(tmp, buf);
    fs.rmSync(p, { force: true });
    fs.renameSync(tmp, p);
    console.log(f, "done", buf.length);
  }
})();
