import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const size = Number(process.argv[3]);

type Sensor = {
  x: number;
  y: number;
  radius: number;
  beaconX: number;
  beaconY: number;
};

type Point = {
  x: number;
  y: number;
};

function distance(p1: Point, p2: Point) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function parseSensor(line: string): Sensor {
  const [x, y, beaconX, beaconY] = line.match(/-?\d+/g)?.flat().map(Number)!;
  const radius = distance({ x, y }, { x: beaconX, y: beaconY });
  return {
    x,
    y,
    radius,
    beaconX,
    beaconY,
  };
  // const [x, y, beaconX, beaconY]
}

const sensors = data.split("\n").map(parseSensor);

const beacons: Set<string> = new Set();
for (const sensor of sensors) {
  beacons.add(`(${sensor.beaconX},${sensor.beaconY})`);
}

function insert(ranges: Range[], range: Range): Range[] {
  // console.log(ranges, range);
  const containing = ranges.find(
    (r) => r.start <= range.start && r.end >= range.end
  );
  if (containing) return ranges;

  const intersecting = ranges.filter((r) => {
    if (r.start >= range.start && r.start <= range.end + 1) return true;
    if (r.end <= range.end && r.end >= range.start - 1) return true;
    return false;
  });
  // console.log("I", intersecting);

  const group = [...intersecting, range];

  const min = group.sort((a, b) => a.start - b.start)[0].start;
  const max = group.sort((a, b) => b.end - a.end)[0].end;

  const rest = ranges.filter((r) => {
    if (
      (r.start >= range.start && r.start <= range.end + 1) ||
      (r.end <= range.end && r.end >= range.start - 1)
    )
      return false;
    return true;
  });

  return [...rest, { start: min, end: max }];
}

function covered(ranges: Range[]) {
  if (ranges.length !== 1) return false;
  return ranges[0].end - ranges[0].start === size;
}

type Range = { start: number; end: number };
const indexes: Record<number, Range[]> = {};
for (let lineY = 0; lineY < size; lineY++) {
  if (!indexes[lineY]) {
    indexes[lineY] = [];
  }

  for (const sensor of sensors) {
    if (!indexes[lineY]) break;
    const d = Math.abs(sensor.y - lineY);
    if (d == sensor.radius) {
      indexes[lineY] = insert(indexes[lineY], {
        start: sensor.x,
        end: sensor.x,
      });
    } else if (d < sensor.radius) {
      const a = sensor.radius - d;

      const start = Math.max(0, sensor.x - a);
      const end = Math.min(size, sensor.x + a);
      indexes[lineY] = insert(indexes[lineY], { start, end });
    }
    if (covered(indexes[lineY])) delete indexes[lineY];
  }
}

console.log("Calculations done..");
console.log(indexes);
const entries = Object.entries(indexes);
const [y, r] = entries[0];
const { end } = r.sort((a, b) => a.end - b.end)[0];
const x = end + 1;

console.log(`RESULT ${x * 4000000 + Number(y)}`);
