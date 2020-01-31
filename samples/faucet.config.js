"use strict";

require = require("esm")(module); // eslint-disable-line no-global-assign
let renderMarkdown = require("../src/markdown.js").default;
let path = require("path");

module.exports = {
	watchDirs: ["./content"],
	gorgeon: [{
		pages: ["./content/index.md"],
		targetDir: "./dist",
		layouts: { default: renderDocument },
		transforms: {
			md: (md, params, context) => renderMarkdown(md, { fragIDs: true })
		}
	}],
	plugins: [path.resolve(__dirname, "../src/faucet.js")]
};

// NB: does not HTML-encode input parameters
function renderDocument({ title, lang = "en" }, html) {
	return `
<!DOCTYPE html>
<html lang="${lang}">

<head>
	<meta charset="utf-8">
	<title>${title}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>
	<h1>${title}</h1>
	${html}
</body>

</html>
	`.trim() + "\n";
}
