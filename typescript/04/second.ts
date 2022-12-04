import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const pairs = data.split("\n").map((s) => s.split(","));

function parse(s: string) {
  const [a, b] = s.split("-");
  return [parseInt(a), parseInt(b)];
}

function isOverlapping(a: number[], b: number[]) {
  return a[0] <= b[0] && a[1] >= b[0];
}

let overlapping = 0;
for (const pair of pairs) {
  const [a, b] = pair.map(parse);
  if (isOverlapping(a, b)) overlapping++;
  else if (isOverlapping(b, a)) overlapping++;
}

console.log(`RESULT ${overlapping}`);
