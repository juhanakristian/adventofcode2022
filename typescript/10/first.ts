import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const instructions = data.split("\n").reverse();

let cpu = {
  x: 1,
  cycle: 1,
};

type State = {
  value: number;
  operation: null | "addx";
};

let state: State = {
  value: 0,
  operation: null,
};

const measure = [20, 60, 100, 140, 180, 220];

let operation: string | undefined = "init"; //instructions.pop();
let result = 0;
while (operation) {
  if (measure.includes(cpu.cycle)) {
    result += cpu.cycle * cpu.x;
  }

  console.log(cpu);
  console.log(state);
  console.log(cpu.cycle * cpu.x);
  // if (cpu.cycle === 100) break;

  operation = state.operation ?? instructions.pop();
  if (!operation) break;

  if (operation === "noop") {
    // do nothing
  } else {
    if (state.operation) {
      const { value } = state;
      cpu.x += value;
      state = {
        ...state,
        operation: null,
        value: 0,
      };
    } else {
      const [_, addx] = operation.split(" ");
      state = {
        value: Number(addx),
        operation: "addx",
      };
    }
  }

  cpu.cycle += 1;
}

console.log(`RESULT ${result}`);
