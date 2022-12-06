import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const window = 14;
for (let i = window; i < data.length; i++) {
  const c = data.slice(i - window, i);
  const set = new Set(c);
  if (set.size === window) {
    console.log(`RESULT ${i}`);
    break;
  }
}
