/* global suite, test */
import { Bundle } from "../src/complate/index.js";
import { fixturePath } from "./util.js";
import { strictEqual as assertSame } from "assert";

suite("MTC");

test.only("rendering", async () => {
	let bundle = new Bundle(fixturePath());
	let jsx = `
import Article from "./article.jsx";
import { safe } from "../../node_modules/complate-ast/dist/lib.js";

<>
	<h1>Hello World</h1>

	<Article title="Lipsum" tags={["foo", "bar"]}>
		{"<p>lorem ipsum dolor sit amet</p>"}
	</Article>
</>
  `;
	let html = await bundle.renderString(jsx, "snippet.jsx");
	// eslint-disable-next-line max-len
	let expected = "<h1>Hello World</h1><article><h2>Lipsum</h2><ol><li>foo</li><li>bar</li></ol><p>lorem ipsum dolor sit amet</p></article>";
	assertSame(html, expected);
});
