import { safe } from "../node_modules/complate-ast/dist/lib.js";

export function Exhibit({ caption }, ...children) {
	return <figure>
		{children}
		<figcaption>{caption}</figcaption>
	</figure>;
}

export function Document({ title, lang = "en" }, html) {
	return <html lang={lang}>
		<head>
			<meta charset="utf-8" />
			<title>{title}</title>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
		</head>

		<body>
			<h1>{title}</h1>
			{safe(html)}
		</body>
	</html>;
}
