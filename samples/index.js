#!/usr/bin/env node -r esm

import WebSite from "../src/site.js";
import path from "path";

let ROOT = __dirname;

main(...process.argv.slice(2));

async function main(configFile) {
	let { config, referenceDir } = readConfig(ROOT, configFile);
	// TODO: enforce relative paths (cf. faucet-pipeline-core)
	let sourceDir = path.resolve(referenceDir, config.source);
	let targetDir = path.resolve(referenceDir, config.target);

	let site = new WebSite(targetDir, config.layouts, config.transforms);
	config.pages.forEach(filename => {
		let filepath = path.resolve(sourceDir, filename);
		site.createPage(filepath, { overwrite: true });
	});
}

// adapted from faucet-pipeline-core
function readConfig(rootDir, filepath = "config.js") {
	let configPath = path.resolve(rootDir, filepath);
	return {
		referenceDir: path.dirname(configPath),
		config: require(configPath).default
	};
}
