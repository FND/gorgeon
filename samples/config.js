import renderMarkdown from "../src/markdown.js";

export default {
	source: "./content",
	target: "./dist",
	pages: ["index.md"],
	layouts: { default: renderDocument },
	transforms: {
		md: (md, params, context) => renderMarkdown(md, { fragIDs: true })
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
