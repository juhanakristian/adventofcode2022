import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

for (let i = 4; i < data.length; i++) {
  const c = data.slice(i - 4, i);
  const set = new Set(c);
  if (set.size === 4) {
    console.log(`RESULT ${i}`);
    break;
  }
}
