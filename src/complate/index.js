import { load } from "../util.js";
import vm from "vm";
import path from "path";

export async function makeTransform(referenceDir) {
	let bundle = await makeBundle(referenceDir);
	return (jsx, params, context) => bundle.
		renderString(jsx, "snippet.jsx", { context: params });
}

export async function makeBundle(referenceDir) {
	// dynamic import here allows for static imports within target module
	let filepath = path.resolve(__dirname, "./bundling");
	let { default: VirtualBundle } = await load(filepath, "complate extension");

	let bundle = new VirtualBundle(referenceDir);
	bundle.renderString = renderString;
	return bundle;
}

async function renderString(code, filename, context = {}) {
	let complate = await load("complate-ast", "complate extension");
	let prefixed = {};
	complate.runtimeSymbols.forEach(key => {
		prefixed[`__gorgeon_${key}`] = complate[key];
	});

	// TODO: generate unique file name to avoid potential race condition for
	//       concurrent access with identical sources?
	let id = this.virtualModule(filename, code);
	this.config.input.input = id; // FIXME: breaks encapsulation
	code = await this.compile();

	let sandbox = { ...context, console, ...prefixed };
	let ast = vm.runInNewContext(code, sandbox);
	return complate.renderToString("raw", ast);
}
