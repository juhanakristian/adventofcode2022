import fs from "fs";

// A rock
// B papre
// C scissors

// X rock
// Y paper
// Z scissors

// 1 for rock
// 2 for paper
// 3 for scissors

// 0 for loss
// 3 for draw
// 6 for win

const points = {
  A: 1,
  B: 2,
  C: 3,
  X: 1,
  Y: 2,
  Z: 3,
};

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

function winner(round: string) {
  const [a, b] = round.split(" ");
  if (a === "A" && b === "Y") return 2;
  if (a === "A" && b === "Z") return 1;
  if (a === "B" && b === "X") return 1;
  if (a === "B" && b === "Z") return 2;
  if (a === "C" && b === "X") return 2;
  if (a === "C" && b === "Y") return 1;
  return 0;
}

function roundScore(round: string) {
  const [_a, b] = round.split(" ");
  const playerPoints = points[b as keyof typeof points];
  const roundWinner = winner(round);
  const resultPoints = roundWinner === 0 ? 3 : roundWinner === 1 ? 0 : 6;
  return playerPoints + resultPoints;
}

const rounds = data.split("\n");

const result = rounds.map(roundScore).reduce((a, b) => a + b, 0);
console.log(`RESULT ${result}`);
