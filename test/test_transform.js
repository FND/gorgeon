/* global suite, test */
import ContentPage from "../src/page/index.js";
import { makeBundle } from "../src/complate/index.js";
import { fixturePath, wait } from "./util.js";
import path from "path";
import { strictEqual as assertSame } from "assert";

suite("content transformation");

test("non-blocking transforms", async () => {
	let filepath = fixturePath("simple.md");
	let page = new ContentPage(filepath);
	let html = await page.render({
		default: (meta, html) => `~~<>~~\n${html}--<>--`
	}, {
		md: async txt => {
			await wait(10);
			return `md:${txt.length}\n`;
		},
		html: async code => {
			await wait(10);
			return `raw:${code.length}\n`;
		}
	});
	assertSame(html, `
~~<>~~
md:27
raw:121
md:52
--<>--
	`.trim());
});

test("inline blocks", async () => {
	let filepath = fixturePath("inline.md");
	let page = new ContentPage(filepath, { _iblockToken: "@iblock@" });
	let html = await page.render({
		default: (meta, html) => `<~>${html}</~>`
	}, {
		md: txt => `<p>${txt.trim()}</p>\n`,
		quote: (txt, { author }) => `<blockquote>${txt} by ${author}</blockquote>\n`,
		cite: txt => `<cite>${txt}</cite>`,
		footnote: txt => `<a href="#fn:${txt.length}">${txt}</a>`
	});
	assertSame(html, `
<~><p>lorem ipsum
<cite>foo …</cite>
dolor sit<a href="#fn:4">amet</a>, consectetur adipisicing
<a href="#fn:4">elit</a>, sed do eiusmod<a href="#fn:6">tempor</a>
incididunt ut labore</p>
<blockquote>bar by J. Doe</blockquote>
<p><cite>baz</cite></p>
</~>
	`.trim());
});

test("complate support", async () => {
	let filepath = fixturePath("componentized.md");
	let page = new ContentPage(filepath);
	let html = await page.render({ default: document }, {
		md: txt => `<p>${txt.trim()}</p>`,
		complate: async (jsx, params, context) => {
			let bundle = await makeBundle(path.dirname(context.origin));
			return bundle.renderString(jsx, "snippet.jsx", params);
		}
	});
	/* eslint-disable max-len */
	assertSame(html, `<!DOCTYPE html>
<html lang="en">
<meta charset="utf-8">
<title>Hello World</title>
<body>
	<h1>Hello World</h1>
<p>lorem ipsum
dolor sit amet</p><figure><canvas width="100" height="100">blank canvas</canvas><figcaption>a blank canvas</figcaption></figure><p>consectetur adipisicing elit,
sed do eiusmod tempor</p>
</body>
</html>
`);
	/* eslint-enable max-len */
});

function document({ title }, html) {
	return `<!DOCTYPE html>
<html lang="en">
<meta charset="utf-8">
<title>${title}</title>
<body>
	<h1>${title}</h1>
${html}
</body>
</html>
`;
}
