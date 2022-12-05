import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const [stackData, instructionsData] = data.split("\n\n");

const stackRows = stackData.split("\n");
const stackCount = stackRows.pop()!.match(/\s\d\s/g)!.length;

console.log(stackCount);

const stacks: string[][] = Array.from({ length: stackCount }, () => []);
for (let i = stackRows.length - 1; i >= 0; i--) {
  for (let j = 0; j < stackCount; j++) {
    const value = stackRows[i][j * 4 + 1];
    if (value === " ") continue;
    stacks[j].push(value);
  }
}
console.log(stacks);

function move(from: number, to: number) {
  const value = stacks[from].pop();
  stacks[to].push(value!);
}

const instructionRows = instructionsData.split("\n");
for (const instruction of instructionRows) {
  const [count, from, to] = instruction.match(/\d+/g)!.map((s) => parseInt(s));
  for (let i = 0; i < count; i++) move(from - 1, to - 1);
}

console.log(stacks);

const topValues = stacks.map((s) => s[s.length - 1]);
const result = topValues.join("");
console.log(`RESULT ${result}`);
