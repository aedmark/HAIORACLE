// Compiles src/rulebooks.ni and installs it into the conductor, as the app
// does at load (D-033). Import it before using any genre-dependent conductor
// function. `GENRES` lists the installed genre codes in menu order.

import { readFile } from "node:fs/promises";

import { genreCodes, installRulebooks } from "../src/conductor.mjs";
import { compileRulebooks } from "../src/inform.mjs";

export const rulebooks = compileRulebooks(await readFile(new URL("../src/rulebooks.ni", import.meta.url), "utf8"));
installRulebooks(rulebooks);
export const GENRES = Object.freeze(genreCodes());
