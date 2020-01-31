"use strict";

require = require("esm")(module); // eslint-disable-line no-global-assign
let WebSite = require("./site.js").default;
let { reportFileStatus } = require("faucet-pipeline-core/lib/util");

module.exports = {
	key: "gorgeon",
	bucket: "static",
	plugin: faucetGorgeon
};

function faucetGorgeon(config, assetManager) {
	let sites = config.map(cfg => new Site(cfg, assetManager));
	return filepaths => Promise.all(sites.
		map(site => site.rebuild(filepaths)));
}

class Site {
	constructor({ pages, targetDir, layouts, transforms }, assetManager) {
		let { resolvePath, referenceDir } = assetManager;
		let resolve = filepath => resolvePath(filepath, { enforceRelative: true });

		this.pages = new Set(pages.map(page => resolve(page))); // TODO: globbing
		this._site = new WebSite(resolve(targetDir), layouts, transforms);
		this._referenceDir = referenceDir;
	}

	rebuild(filepaths) {
		if(!filepaths) { // initialization
			return this.build();
		}

		let { pages } = this;
		let matches = filepaths.filter(filepath => pages.has(filepath));
		if(!matches.length) {
			return;
		}
		return this.build(matches);
	}

	build(pages = [...this.pages]) {
		let { _site, _referenceDir } = this;
		let ops = pages.map(async filepath => {
			filepath = await _site.createPage(filepath, {
				overwrite: true
			});
			reportFileStatus(filepath, _referenceDir);
		});
		return Promise.all(ops);
	}
}
