import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const rugsacks = data.split("\n");

function priority(c: string) {
  const code = c.charCodeAt(0);
  if (code >= 97) return code - 96;
  else return code - 65 + 27;
}

function findBadge(a: string, b: string, c: string) {
  const sa = new Set(a.split(""));
  const sb = new Set(b.split(""));
  const sc = new Set(c.split(""));

  for (const ch of sa) {
    if (sb.has(ch) && sc.has(ch)) return ch;
  }

  return "";
}

let result = 0;
for (let i = 0; i < rugsacks.length; i += 3) {
  const a = rugsacks[i];
  const b = rugsacks[i + 1];
  const c = rugsacks[i + 2];
  result += priority(findBadge(a, b, c));
}

console.log(`RESULT ${result}`);
