/*
// FIXME: this import fails, but should work
*/
import { safe } from "../node_modules/complate-ast/dist/index.js";

export function Exhibit({ caption }, ...children) {
	return <figure>
		{children}
		<figcaption>{caption}</figcaption>
	</figure>;
}

export function Document({ title, lang = "en" }, html) {
	return <>
		{safe("<!DOCTYPE html>")}
		<html lang={lang}>
			<head>
				<meta charset="utf-8" />
				<title>{title}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</head>

			<body>
				<h1>{title}</h1>
				{safe(html)}
			</body>
		</html>
	</>;
}
