import _Bundle from "./bundling.js";
import { load } from "../util.js";
import vm from "vm";

export default function makeTransform(referenceDir) {
	let bundle = new Bundle(referenceDir);
	return (jsx, params, context) => bundle.renderString(jsx, "snippet.jsx",
			{ context: params });
}

export class Bundle extends _Bundle {
	async renderString(code, filename, context) {
		let { renderToString } = await load("rodunj/src/render", "complate extension");

		// TODO: generate unique file name to avoid potential race condition for
		//       concurrent access with identical sources?
		let id = await this.virtualModule(filename, code);
		code = await this.generate(id);

		let sandbox = context ? { ...context } : {};
		let segments = vm.runInNewContext(code, sandbox);
		return renderToString(...segments);
	}
}
