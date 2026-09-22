import { Resvg } from "@resvg/resvg-js";
import { readFile, writeFile } from "node:fs/promises";
const mark = await readFile("media/mark.svg", "utf8");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="#1c2945"/><g transform="translate(8 5) scale(2.8)">${mark.replace(/<svg[^>]*>/, "").replace("</svg>", "")}</g></svg>`;
await writeFile("media/icon.png", new Resvg(svg).render().asPng());
