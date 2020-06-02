import { Bundle, Config } from "beatdown";
import diskless from "beatdown/lib/diskless";
import { Plugin } from "beatdown/lib/config/plugin";
import { complate } from "complate-ast";
import acornJSX from "acorn-jsx";

export default class VirtualBundle extends Bundle {
	constructor(referenceDir) {
		let dl = diskless({ referenceDir });

		let config = new Config(`${dl.prefix}:index.js`, {
			treeshaking: false,
			compact: true,
			parser: acornJSX()
		});
		config.addPlugin(new Plugin("diskless", dl));
		config.addPlugin(new Plugin("complate-ast", complate, { prefix: "__gorgeon_" }));
		super(config);

		this._diskless = dl;
	}

	virtualModule(filename, code) {
		return this._diskless.register(filename, code);
	}
}
