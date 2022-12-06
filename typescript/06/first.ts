import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

let i = 3;
for (; i < data.length; i++) {
  const c = data.slice(i - 3, i + 1);
  const set = new Set(c);
  if (set.size === 4) break;
}

console.log(`RESULT ${i + 1}`);
