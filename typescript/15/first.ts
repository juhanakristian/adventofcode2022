import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const lineY = Number(process.argv[3]);

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
const maxX = sensors.sort((s1, s2) => s2.beaconX - s1.beaconX)[0].beaconX;
const minX = sensors.sort((s1, s2) => s1.beaconX - s2.beaconX)[0].beaconX;

console.log(minX, maxX);

const beacons: Set<string> = new Set();
for (const sensor of sensors) {
  beacons.add(`(${sensor.beaconX},${sensor.beaconY})`);
}

const indexes: Set<number> = new Set();
for (const sensor of sensors) {
  const d = Math.abs(sensor.y - lineY);
  if (d <= sensor.radius) {
    const startX = sensor.x - sensor.radius;
    const endX = sensor.x + sensor.radius;
    for (let x = startX; x < endX; x++) {
      if (beacons.has(`(${x},${lineY})`)) continue;
      const pd = distance({ x: sensor.x, y: sensor.y }, { x, y: lineY });
      if (pd <= sensor.radius) {
        indexes.add(x);
      }
    }
  }
}

// let line = "";
// for (let x = minX; x < maxX; x++) {
//   if (beacons.has(`(${x},${lineY})`)) {
//     line += "B";
//     continue;
//   }
//   line += indexes.has(x) ? "#" : ".";
// }
// console.log(line);

console.log(`RESULT ${indexes.size}`);
