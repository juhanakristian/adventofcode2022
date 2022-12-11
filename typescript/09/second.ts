import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

function render(r: [number, number][]) {
  for (let y = 30; y > -30; y--) {
    let line = "";
    for (let x = -30; x < 30; x++) {
      // line += visited.has(`(${x},${y})`) ? "#" : ".";
      if (x === 0 && y === 0) {
        line += "s";
      } else {
        const knot = r.findIndex(([kx, ky]) => x === kx && y === ky);
        line += knot === -1 ? "." : knot;
      }
    }
    console.log(line);
  }
}

const visited: Set<string> = new Set(["(0,0)"]);
const rope: [number, number][] = Array.from({ length: 10 }, () => [0, 0]);
// let head: [number, number] = [0, 0];
// let tail: [number, number] = [0, 0];

type Direction = "U" | "D" | "R" | "L";
const vectors: Record<Direction, [number, number]> = {
  U: [0, 1],
  D: [0, -1],
  R: [1, 0],
  L: [-1, 0],
};

function move(direction: Direction) {
  const [x, y] = rope[0];
  const [dx, dy] = vectors[direction];

  rope[0] = [x + dx, y + dy];

  for (let i = 1; i < 10; i++) {
    const [px, py] = rope[i - 1];
    const [cx, cy] = rope[i];
    const dx = px - cx;
    const dy = py - cy;
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) break;
    // Vertical
    if (dx === 0) {
      rope[i] = [cx, cy + dy / Math.abs(dy)];
    } else if (dy === 0) {
      rope[i] = [cx + dx / Math.abs(dx), cy];
    } else {
      rope[i] = [cx + dx / Math.abs(dx), cy + dy / Math.abs(dy)];
    }

    if (i === 9) visited.add(`(${rope[i][0]},${rope[i][1]})`);
  }
}

const lines = data.split("\n");
// render(rope);
for (const line of lines) {
  const [direction, count] = line.split(" ");
  for (let i = 0; i < Number(count); i++) {
    move(direction as Direction);
  }
  // render(rope);
}

console.log(`RESULT ${visited.size}`);
