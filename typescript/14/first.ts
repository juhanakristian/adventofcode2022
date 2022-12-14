import fs from "fs";

function render(map: string[][]) {
  for (let y = 0; y < map.length; y++) {
    let line = "";
    for (let x = 0; x < map[y].length; x++) {
      line += map[y][x];
    }
    console.log(line);
  }
}

function between(start: number[], end: number[]) {
  if (start[0] === end[0]) {
    const diff = end[1] - start[1];
    const points: number[][] = [];
    for (let i = 0; i < Math.abs(diff); i++) {
      const sign = Math.abs(diff) / diff;
      points.push([start[0], start[1] + i * sign]);
    }
    points.push([start[0], end[1]]);
    return points;
  }

  const diff = end[0] - start[0];
  const points: number[][] = [];
  for (let i = 0; i < Math.abs(diff); i++) {
    const sign = Math.abs(diff) / diff;
    points.push([start[0] + i * sign, start[1]]);
  }
  points.push([end[0], start[1]]);
  return points;
}

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const columns = data
  .match(/\d+(?=,)/gm)
  ?.map(Number)
  .sort((a, b) => b - a);

const maxX = columns![0];
const minX = columns![columns!.length - 1];

const height = data
  .match(/(?<=,)\d+/gm)
  ?.map(Number)
  .sort((a, b) => b - a)[0];

const map: string[][] = Array.from({ length: height! + 1 }, () =>
  Array.from({ length: maxX - minX + 1 }, () => ".")
);

const paths = data.split("\n");
for (const path of paths) {
  const points = path.split(" -> ").map((p) => p.split(",").map(Number));
  points.reverse();

  let current = points.pop();
  while (points.length > 0) {
    const next = points.pop();
    const line = between(current!, next!);
    for (const lp of line) {
      map[lp[1]][lp[0] - minX] = "#";
    }
    current = next;
  }
}

let sand = {
  x: 500 - minX,
  y: 0,
};

let count = 0;
while (sand.y < height!) {
  const down = map[sand.y + 1][sand.x];
  const left = map[sand.y + 1][sand.x - 1];
  const right = map[sand.y + 1][sand.x + 1];
  if (!down || !left || !right) break;

  if (down === ".") {
    sand = { x: sand.x, y: sand.y + 1 };
    continue;
  } else if (left === ".") {
    sand = { x: sand.x - 1, y: sand.y + 1 };
    continue;
  } else if (right === ".") {
    sand = { x: sand.x + 1, y: sand.y + 1 };
    continue;
  }

  map[sand.y][sand.x] = "o";
  if (sand.y === 0) break;
  sand = {
    x: 500 - minX,
    y: 0,
  };
  count++;
}

render(map);

console.log(`RESULT ${count}`);
