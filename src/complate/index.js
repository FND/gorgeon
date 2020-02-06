import _Bundle from "./bundling.js";
import { load, abort } from "../util.js";
import { safe } from "complate-ast";
import vm from "vm";

let DOCTYPE = "<!DOCTYPE html>";
let LAYOUT = (component, filepath) => `
import { ${component} } from "${filepath}";

<${component} {...context}>{context._html}</${component}>
`;

// generates a layout function for the given `component` name, to be imported
// from `filepath`, relative to `referenceDir`
// XXX: workaround for complate-ast's lack of support for document types
export function makeRenderer(component, filepath, referenceDir) {
	if(/[^a-zA-Z0-9]/.test(component)) { // primitive heuristic
		abort("ERROR: layout component names must be alphanumeric; " +
				`\`${component}\` is invalid`);
	}
	if(filepath.includes('"')) {
		abort(`ERROR: invalid module path \`${component}\``);
	}
	let renderComponent = makeTransform(referenceDir);
	let jsx = LAYOUT(component, filepath);

	return async function renderDocument(meta, html) {
		html = await renderComponent(jsx, { ...meta, _html: safe(html) });
		return `${DOCTYPE}\n${html}`;
	};
}

export function makeTransform(referenceDir) {
	let bundle = new Bundle(referenceDir);
	return (jsx, params, context) => bundle.
		renderString(jsx, "snippet.jsx", { context: params });
}

export class Bundle extends _Bundle {
	async renderString(code, filename, context) {
		let JSXRuntime = await load("complate-ast/dist/runtime", "complate extension");

		// TODO: generate unique file name to avoid potential race condition for
		//       concurrent access with identical sources?
		let id = await this.virtualModule(filename, code);
		code = await this.generate(id);

		let sandbox = { ...context, ...JSXRuntime };
		let ast = vm.runInNewContext(code, sandbox);
		return ast.pop ? ast.map(ast => ast.value).join("") : ast.value;
	}
}
