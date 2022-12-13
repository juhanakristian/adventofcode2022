import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const pairs = data.split("\n\n").map((l) => l.split("\n").map(eval));
// console.log(pairs);

type ComapareReslt = 0 | 1 | 2;
function compare(
  left: number | number[],
  right: number | number[]
): ComapareReslt {
  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length === 0 && right.length === 0) return 0;
    if (left.length === 0) return 1;
    if (right.length === 0) return 2;
    for (let i = 0; i < left.length; i++) {
      if (i >= right.length) return 2;
      const result = compare(left[i], right[i]);
      if (result === 1) return 1;
      if (result === 2) return 2;
    }
    return 1;
  }

  if (Array.isArray(left) && typeof right === "number") {
    return compare(left, [right]);
  } else if (Array.isArray(right) && typeof left === "number") {
    return compare([left], right);
  }

  if (left === right) return 0;

  return left < right ? 1 : 2;
}

const ordering = pairs.map((p, i) => ({
  result: compare(p[0], p[1]),
  index: i + 1,
}));

const result = ordering
  .filter((o) => o.result === 1)
  .map((o) => o.index)
  .reduce((a, b) => a + b);

console.log(ordering);
console.log(`RESULT ${result}`);
