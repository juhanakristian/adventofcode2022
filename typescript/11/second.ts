import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

type Monkey = {
  items: bigint[];
  operation: (value: bigint) => bigint;
  divisor: number;
  onTrue: number;
  onFalse: number;
  processedItems: number;
  mod?: number;
};

function parseItems(data: string) {
  // Starting items: 79, 98
  return data
    .replace("Starting items:", "")
    .trim()
    .split(",")
    .map((p) => BigInt(p.trim()));
}

function parseOperation(data: string) {
  // Operation: new = old * 19
  return (v: bigint) => {
    let expression = data.replace("Operation: new =", "");

    const nums = expression.match(/\d+/g);
    if (nums) {
      for (const m of nums!) {
        const rx = new RegExp(`${m}($|\\s)`);
        expression = expression.replace(rx, `${m}n`);
      }
    }
    expression = expression.replace(/old/g, `${v}n`);

    return eval(expression);
  };
}

function parseMonkey(data: string[]) {
  const [monkey, items, operation, test, ifTrue, ifFalse, _empty, ...rest] =
    data;

  const id = Number(monkey.match(/\d+/)?.[0]);
  const monkeyData: Monkey = {
    items: parseItems(items),
    operation: parseOperation(operation),
    divisor: Number(test.match(/\d+/)?.[0] ?? 0),
    onTrue: Number(ifTrue.match(/\d+/)?.[0]) ?? -1,
    onFalse: Number(ifFalse.match(/\d+/)?.[0]) ?? -1,
    processedItems: 0,
  };

  return { data: rest, monkey: monkeyData, id };
}

let lines = data.split("\n");

let monkeys: Record<number, Monkey> = {};

while (lines.length > 0) {
  const result = parseMonkey(lines);
  monkeys[result.id] = result.monkey;
  lines = result.data;
}

// add common modulo
const mod = Object.values(monkeys).reduce(
  (acc, monkey) => acc * monkey.divisor,
  1
);

for (const key of Object.keys(monkeys)) {
  monkeys[Number(key)] = {
    ...monkeys[Number(key)],
    mod,
  };
}

function throwItem(item: bigint, to: number) {
  monkeys = {
    ...monkeys,
    [to]: {
      ...monkeys[to],
      items: [...monkeys[to].items, item],
    },
  };
}

function processRound(monkey: number) {
  const { items, operation, mod, divisor, onTrue, onFalse, processedItems } =
    monkeys[monkey];

  for (const item of items) {
    const worry = operation(item);

    const result = worry % BigInt(divisor) === 0n;
    const num = worry % BigInt(mod!);
    if (result) throwItem(num, onTrue);
    else throwItem(num, onFalse);
  }

  const updatedMonkey = {
    ...monkeys[monkey],
    items: [],
    processedItems: processedItems + items.length,
  };

  monkeys = {
    ...monkeys,
    [monkey]: updatedMonkey,
  };
}

for (let i = 0; i < 10000; i++) {
  const monkeyList = Object.keys(monkeys).sort((a, b) => Number(a) - Number(b));
  for (const monkey of monkeyList) {
    processRound(Number(monkey));
  }
}

const top = Object.values(monkeys)
  .map((m) => m.processedItems)
  .sort((a, b) => b - a);
const result = top[0] * top[1];

console.log(`RESULT ${result}`);
