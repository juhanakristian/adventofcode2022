import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const pairs = data.split("\n").map((s) => s.split(","));

function parse(s: string) {
  const [a, b] = s.split("-");
  return [parseInt(a), parseInt(b)];
}

function isContained(a: number[], b: number[]) {
  return a[0] <= b[0] && a[1] >= b[1];
}

let contained = 0;
for (const pair of pairs) {
  const [a, b] = pair.map(parse);
  if (isContained(a, b)) contained++;
  else if (isContained(b, a)) contained++;
}

console.log(`RESULT ${contained}`);
