import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const elevation: Record<string, number> = {
  //letters a to z
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
  j: 10,
  k: 11,
  l: 12,
  m: 13,
  n: 14,
  o: 15,
  p: 16,
  q: 17,
  r: 18,
  s: 19,
  t: 20,
  u: 21,
  v: 22,
  w: 23,
  x: 24,
  y: 25,
  z: 26,
  E: 26,
  S: 1,
};

const map: string[][] = data.split("\n").map((line) => line.split(""));

type Point = {
  x: number;
  y: number;
};

let start: Point | null = null;
let end: Point | null = null;
const width = map[0].length;
const height = map.length;

for (let y = 0; y < map.length; y++) {
  if (start && end) break;
  for (let x = 0; x < map[y].length; x++) {
    if (start && end) break;
    const c = map[y][x];
    if (c === "E") {
      end = { x, y };
    } else if (c === "S") {
      start = { x, y };
    }
  }
}

function isValid(point: Point, next: Point, map: string[][]) {
  const pvalue = map[point.y][point.x];
  const nvalue = map[next.y][next.x];
  // console.log(nvalue, pvalue);
  return elevation[nvalue] - elevation[pvalue] < 2;
}

function distance(p1: Point, p2: Point) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function neighbors(point: Point) {
  const n: Point[] = [];
  const { x, y } = point;
  if (point.y > 0) n.push({ x, y: y - 1 });
  if (point.y < height - 1) n.push({ x, y: y + 1 });
  if (point.x > 0) n.push({ x: x - 1, y });
  if (point.x < width - 1) n.push({ x: x + 1, y });

  return n;
}

function key(p: Point) {
  return `(${p.x},${p.y})`;
}

function reconstructPath(from: Map<string, Point>, end: Point) {
  const path = [end];
  let current = end;
  while (from.has(key(current))) {
    current = from.get(key(current))!;
    path.push(current);
  }

  return path;
}

function astar(start: Point, target: Point, map: string[][]): Point[] {
  let open = [start];
  const from: Map<string, Point> = new Map();

  const gscore: Map<string, number> = new Map();
  gscore.set(key(start), 0);
  const fscore: Map<string, number> = new Map();
  fscore.set(key(start), distance(start, target));

  while (open.length > 0) {
    const current = open.sort(
      (a, b) => fscore.get(key(a))! - fscore.get(key(b))!
    )[0];

    if (current.x === target.x && current.y === target.y)
      return reconstructPath(from, current);

    open = open.filter((p) => key(p) !== key(current));
    const n = neighbors(current);
    for (const nb of n) {
      if (!isValid(current, nb, map)) continue;
      const g = gscore.get(key(current))! + 1;
      if (g < (gscore.get(key(nb)) ?? Infinity)) {
        from.set(key(nb), current);
        gscore.set(key(nb), g);
        fscore.set(key(nb), g + distance(nb, target));
        if (open.findIndex((p) => p.x === nb.x && p.y === nb.y) === -1)
          open.push(nb);
      }
    }
  }

  return [];
}

const route = astar(start!, end!, map);
console.log(`RESULT ${route.length - 1}`);
