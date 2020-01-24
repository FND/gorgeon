import makeTransform from "../src/complate/index.js";
import renderMarkdown from "../src/markdown.js";

let renderComponent = makeTransform(__dirname);

export default {
	source: "./content",
	target: "./dist",
	pages: ["index.md", "components.md"],
	layouts: { default: renderDocument },
	transforms: {
		md: (md, params, context) => renderMarkdown(md, { fragIDs: true }),
		complate: renderComponent
	}
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
