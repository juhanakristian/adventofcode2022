import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const window = 14;
let i = window - 1;
for (; i < data.length; i++) {
  const c = data.slice(i - (window - 1), i + 1);
  const set = new Set(c);
  if (set.size === window) break;
}

console.log(`RESULT ${i + 1}`);
