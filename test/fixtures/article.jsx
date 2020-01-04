import List from "./list.jsx";

export default function Article({ title, tags }, ...children) {
	return <article>
		<h2>{title}</h2>
		<List ordered>{[...tags]}</List>
		{children}
	</article>;
}
