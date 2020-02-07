import diskless from "./diskless";
import { load } from "../util.js";

let COMPLATE, ROLLUP, JSX; // NB: loaded lazily

let INPUT_CONFIG = {
	treeshake: false // TODO: configurable?
};
let OUTPUT_CONFIG = {
	indent: false,
	compact: true,
	format: "esm" // TODO: configurable?
	// TODO: support for `name`, `globals`, `sourcemap`
};

export default class Bundle {
	constructor(referenceDir) {
		this.referenceDir = referenceDir;
		this._init();
	}

	async virtualModule(filename, code) {
		await this._init();
		return this._diskless.register(filename, code);
	}

	async generate(entryPoint) {
		await this._init();
		let bundle = await ROLLUP({
			acornInjectPlugins: [JSX],
			...INPUT_CONFIG,
			plugins: [COMPLATE, this._diskless],
			input: entryPoint,
			// TODO: support for `external`
			cache: this._cache
		});
		this._cache = bundle;

		let { output } = await bundle.generate({
			...OUTPUT_CONFIG
		});
		if(output.length !== 1) { // just to be safe
			throw new Error("unexpected chunking");
		}
		let { code } = output[0];
		return code;
	}

	// lazily loads dependencies before initializing
	async _init() {
		if(this._diskless) {
			return;
		}
		if(this._pending) {
			return this._pending;
		}

		let pending = this._pending = Promise.all([
			"complate-ast/dist/bundles/rollup",
			"rollup",
			"acorn-jsx"
		].map(pkg => load(pkg, "complate extension")));

		let [complate, rollup, jsx] = await pending;
		COMPLATE = complate.default({
      importPath: `${__dirname}/../../node_modules/complate-ast/dist/runtime.js`
		});
		ROLLUP = rollup.rollup;
		JSX = jsx.default();

		this._diskless = diskless(this.referenceDir);
	}
}
