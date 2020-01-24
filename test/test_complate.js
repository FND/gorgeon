/* global suite, test */
import { Bundle } from "../src/complate/index.js";
import { fixturePath } from "./util.js";
import { strictEqual as assertSame } from "assert";

suite("complate extension");

test("rendering", async () => {
	let bundle = new Bundle(fixturePath());
	let html = await bundle.renderString(`
import Article from "./article.jsx";

<>
	<h1>Hello World</h1>

	<Article title="Lipsum" tags={["foo", "bar"]}>
		<p>lorem ipsum dolor sit amet</p>
	</Article>
</>
	`, "snippet.jsx");
	assertSame(html.replace(/\n|\t/g, ""), // eslint-disable-next-line max-len
			"<h1>Hello World</h1><article><h2>Lipsum</h2><ol><li>foo</li><li>bar</li></ol><p>lorem ipsum dolor sit amet</p></article>");
});
