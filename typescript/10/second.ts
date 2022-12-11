import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const instructions = data.split("\n").reverse();

type Cpu = {
  x: number;
  cycle: number;
};

const cpu = {
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

let buffer = "";
function crt(cpu: Cpu) {
  const sprite = [cpu.x - 1, cpu.x, cpu.x + 1];
  const c = sprite.includes(buffer.length) ? "#" : ".";
  buffer += c;
  if (buffer.length === 40) {
    console.log(buffer);
    buffer = "";
  }
}

let operation: string | undefined = "init";
while (operation) {
  operation = state.operation ?? instructions.pop();
  if (!operation) break;

  crt(cpu);
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
