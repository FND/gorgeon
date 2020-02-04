"use strict";

require = require("esm")(module); // eslint-disable-line no-global-assign
let renderMarkdown = require("../src/markdown.js").default;
let { makeRenderer, makeTransform } = require("../src/complate/index.js");
let path = require("path");

module.exports = {
	watchDirs: ["./content"],
	gorgeon: [{
		pages: ["./content/index.md", "./content/components.md"],
		targetDir: "./dist",
		layouts: {
			default: makeRenderer("Document", "./components.jsx", __dirname)
		},
		transforms: {
			md: (md, params, context) => renderMarkdown(md, { fragIDs: true }),
			complate: makeTransform(__dirname)
		}
	}],
	plugins: [path.resolve(__dirname, "../src/faucet.js")]
};
