import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

type Monkey = {
  items: number[];
  operation: (value: number) => number;
  test: (value: number) => boolean;
  onTrue: number;
  onFalse: number;
  processedItems: number;
};

function parseItems(data: string) {
  // Starting items: 79, 98
  return data
    .replace("Starting items:", "")
    .trim()
    .split(",")
    .map((p) => parseInt(p.trim()));
}

function parseOperation(data: string) {
  // Operation: new = old * 19
  return (v: number) => {
    return eval(data.replace("new =", "").replace(/old/g, String(v)));
  };
}

function parseTest(data: string) {
  const divider = Number(data.match(/\d+/)?.[0]);
  return (v: number) => {
    return v % divider === 0;
  };
}

function parseMonkey(data: string[]) {
  /*
  Monkey 0:
    Starting items: 79, 98
    Operation: new = old * 19
    Test: divisible by 23
      If true: throw to monkey 2
      If false: throw to monkey 3
  */

  const [monkey, items, operation, test, ifTrue, ifFalse, _empty, ...rest] =
    data;

  const id = Number(monkey.match(/\d+/)?.[0]);
  const monkeyData: Monkey = {
    items: parseItems(items),
    operation: parseOperation(operation),
    test: parseTest(test),
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

function throwItem(item: number, to: number) {
  monkeys = {
    ...monkeys,
    [to]: {
      ...monkeys[to],
      items: [...monkeys[to].items, item],
    },
  };
}

function processRound(monkey: number) {
  // loop items
  //calculate worry level
  // divider by three and round
  // test
  // throw

  const { items, operation, test, onTrue, onFalse, processedItems } =
    monkeys[monkey];

  for (const item of items) {
    const worry = Math.floor(operation(item) / 3.0);
    const result = test(worry);
    if (result) throwItem(worry, onTrue);
    else throwItem(worry, onFalse);
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

for (let i = 0; i < 20; i++) {
  const monkeyList = Object.keys(monkeys).sort((a, b) => Number(a) - Number(b));
  for (const monkey of monkeyList) {
    processRound(Number(monkey));
  }
}

const top = Object.values(monkeys)
  .map((m) => m.processedItems)
  .sort((a, b) => b - a);
console.log(top);
const result = top[0] * top[1];

console.log(monkeys);
console.log(`RESULT ${result}`);
