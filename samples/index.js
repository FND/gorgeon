#!/usr/bin/env node -r esm

import config from "./config.js";
import WebSite from "../src/site.js";
import path from "path";

let ROOT = __dirname;

main();

async function main() {
	// TODO: all paths should be relative to `config.js` (cf. faucet)
	let sourceDir = path.resolve(ROOT, config.source);
	let targetDir = path.resolve(ROOT, config.target);

	let site = new WebSite(targetDir, config.layouts, config.transforms);
	config.pages.forEach(filename => {
		let filepath = path.resolve(sourceDir, filename);
		site.createPage(filepath, { overwrite: true });
	});
}
