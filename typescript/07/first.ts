import fs from "fs";

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

function ls(current: string) {
  const folders = current.split("/");
  const files = folders.map((f) => `${f}/`);
  return files;
}

function cmd(command: string, current: string) {
  const [_, cmd, ...rest] = command.split(" ");
  if (cmd === "ls") return { current, cmd: "ls" };

  // cd
  const [path] = rest;
  if (path == "..") {
    const folders = current.split("/").filter((f) => f !== "");
    folders.pop();
    return { current: `/${folders.join("/")}`, cmd: "cd" };
  }

  if (path == "/") {
    return { current: "/", cmd: "cd" };
  }

  if (current === "/") return { current: `${current}${path}`, cmd: "cd" };

  return { current: `${current}/${path}`, cmd: "cd" };
}

const sizes: Record<string, number> = {};
const lines = data.split("\n");
let current = "";

for (const line of lines) {
  if (line.startsWith("$")) {
    const env = cmd(line, current);
    current = env.current;
  }

  if (line.startsWith("dir")) continue;

  const size = Number(line.split(" ")[0]);
  if (isNaN(size)) continue;

  let c = String(current);
  while (c.length > 1) {
    sizes[c] = (sizes[c] || 0) + size;
    const path = c.split("/").filter((f) => f !== "");
    path.pop();
    if (path.length === 0) break;

    c = `/${path.join("/")}`;
  }
  sizes["/"] = (sizes["/"] || 0) + size;
}

const result = Object.entries(sizes)
  .filter(([_, size]) => size < 100000)
  .reduce((acc, [_path, size]) => acc + size, 0);
console.log(`RESULT ${result}`);

// console.log(sizes);
