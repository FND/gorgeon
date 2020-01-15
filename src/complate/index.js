import _Bundle from "./bundling.js";
import { load } from "../util.js";
import vm from "vm";

export default class Bundle extends _Bundle {
	async renderString(code, filename, context) {
		let JSXRuntime = await load("complate-ast/dist/runtime", "complate-ast runtime");

		// TODO: generate unique file name to avoid potential race condition for
		//       concurrent access with identical sources?
		let id = await this.virtualModule(filename, code);
		code = await this.generate(id);

		let sandbox = { ...context, JSXRuntime: JSXRuntime };
		let ast = vm.runInNewContext(code, sandbox);
		return ast.value;
	}
}
