import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

function half(array: string) {
  const halfPoint = Math.ceil(array.length / 2);
  const first = array.slice(0, halfPoint);
  const second = array.slice(-halfPoint);
  return [first, second];
}

const rugsacks = data.split("\n").map((s) => half(s));

function findType(a: string, b: string) {
  const sa = new Set(a.split(""));
  const sb = new Set(b.split(""));

  for (const c of sa) {
    if (sb.has(c)) return c;
  }

  return "";
}

const intersections = rugsacks.map((rs) => findType(rs[0], rs[1]));

function priority(c: string) {
  const code = c.charCodeAt(0);
  if (code >= 97) return code - 96;
  else return code - 65 + 27;
}
const scores = intersections.map((c) => priority(c));
const result = scores.reduce((a, b) => a + b, 0);
console.log(`RESULT ${result}`);
