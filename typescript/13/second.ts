import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const rows = data
  .split("\n\n")
  .map((l) => l.split("\n").map(eval))
  .flat();

type ComapareReslt = 0 | -1 | 1;
function compare(
  left: number | number[],
  right: number | number[]
): ComapareReslt {
  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length === 0 && right.length === 0) return 0;
    if (left.length === 0) return -1;
    if (right.length === 0) return 1;
    for (let i = 0; i < left.length; i++) {
      if (i >= right.length) return 1;
      const result = compare(left[i], right[i]);
      if (result === -1) return -1;
      if (result === 1) return 1;
    }
    return -1;
  }

  if (Array.isArray(left) && typeof right === "number") {
    return compare(left, [right]);
  } else if (Array.isArray(right) && typeof left === "number") {
    return compare([left], right);
  }

  if (left === right) return 0;

  return left < right ? -1 : 1;
}

rows.push([[2]]);
rows.push([[6]]);
const sorted = rows.sort(compare);

const firstIndex =
  sorted.findIndex(
    (a) => a.length === 1 && a[0].length === 1 && a[0][0] === 2
  ) + 1;

const secondIndex =
  sorted.findIndex(
    (a) => a.length === 1 && a[0].length === 1 && a[0][0] === 6
  ) + 1;

console.log(`RESULT ${firstIndex * secondIndex}`);
