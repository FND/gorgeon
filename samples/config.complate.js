import Bundle from "../src/complate/index.js";
import renderMarkdown from "../src/markdown.js";

let BUNDLE = new Bundle(__dirname);

export default {
	source: "./content",
	target: "./dist",
	pages: ["index.md", "components.md"],
	layouts: { default: renderDocument },
	transforms: {
		md: (md, params, context) => renderMarkdown(md, { fragIDs: true }),
		complate: (jsx, params, context) => BUNDLE.
			renderString(jsx, "snippet.jsx", { context: params })
	}
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
