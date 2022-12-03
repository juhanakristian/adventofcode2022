import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const elfs = data.split("\n\n");

function sum(total: number, current: number) {
  return total + current;
}

const elfTotals = elfs.map((ec) =>
  ec
    .split("\n")
    .map((c) => Number(c))
    .reduce(sum, 0)
);

const sortedElfs = elfTotals.sort((a, b) => b - a);

const [first, second, third, ...rest] = sortedElfs;

console.log(`RESULT ${first + second + third}`);
// console.log(`RESULT ${elfTotals.indexOf(max) + 1} ${max}`);
