"use strict";

require = require("esm")(module); // eslint-disable-line no-global-assign
let renderMarkdown = require("../src/markdown.js").default;
let makeTransform = require("../src/complate/index.js").default;
let path = require("path");

let renderComponent = makeTransform(__dirname);

module.exports = {
	watchDirs: ["./content"],
	gorgeon: [{
		pages: ["./content/index.md", "./content/components.md"],
		targetDir: "./dist",
		layouts: { default: renderDocument },
		transforms: {
			md: (md, params, context) => renderMarkdown(md, { fragIDs: true }),
			complate: renderComponent
		}
	}],
	plugins: [path.resolve(__dirname, "../src/faucet.js")]
};

async function renderDocument(meta, html) {
	// XXX: workarounds for Rodunj's lack of support for raw HTML and document types
	let placeholder = "%CONTENT%";
	let _html = await renderComponent(`
import { Document } from "./components.jsx";

<Document {...context}>${placeholder}</Document>
	`, meta);
	return "<!DOCTYPE html>\n" + _html.replace(placeholder, html);
}
