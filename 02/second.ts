import fs from "fs";

const points: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  X: 1,
  Y: 2,
  Z: 3,
};

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const player: Record<string, string> = {
  "A X": "C",
  "A Y": "A",
  "A Z": "B",

  "B X": "A",
  "B Y": "B",
  "B Z": "C",

  "C X": "B",
  "C Y": "C",
  "C Z": "A",
};

function roundScore(round: string) {
  const [_a, b] = round.split(" ");
  const playerPoints = points[player[round]];
  const resultPoints = b === "X" ? 0 : b === "Y" ? 3 : 6;
  return playerPoints + resultPoints;
}

const rounds = data.split("\n");

const result = rounds.map(roundScore).reduce((a, b) => a + b, 0);
console.log(`RESULT ${result}`);
