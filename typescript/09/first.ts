import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const visited: Set<string> = new Set(["(0,0)"]);
let head: [number, number] = [0, 0];
let tail: [number, number] = [0, 0];

type Direction = "U" | "D" | "R" | "L";
const vectors: Record<Direction, [number, number]> = {
  U: [0, 1],
  D: [0, -1],
  R: [1, 0],
  L: [-1, 0],
};

function isAdjacent(p1: [number, number], p2: [number, number]) {
  const adjacentY = [p1[1], p1[1] - 1, p1[1] + 1];
  const adjacentX = [p1[0], p1[0] - 1, p1[0] + 1];
  return adjacentX.includes(p2[0]) && adjacentY.includes(p2[1]);
}

function move(direction: Direction) {
  const [x, y] = head;
  const [dx, dy] = vectors[direction];

  head = [x + dx, y + dy];

  const [px, py] = head;
  const [cx, cy] = tail;
  const diffx = px - cx;
  const diffy = py - cy;
  if (Math.abs(diffx) < 2 && Math.abs(diffy) < 2) return;
  if (diffx === 0) {
    tail = [cx, cy + diffy / Math.abs(diffy)];
  } else if (diffy === 0) {
    tail = [cx + diffx / Math.abs(diffx), cy];
  } else {
    tail = [cx + diffx / Math.abs(diffx), cy + diffy / Math.abs(diffy)];
  }

  visited.add(`(${tail[0]},${tail[1]})`);
}

const lines = data.split("\n");
for (const line of lines) {
  const [direction, count] = line.split(" ");
  for (let i = 0; i < Number(count); i++) {
    move(direction as Direction);
  }
}

console.log(`RESULT ${visited.size}`);
