import { readFileSync } from "fs";
import { marked } from "marked";
import dompurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = dompurify(window as unknown as Window);

const chromaRegex = /<chroma>([^]*?)<\/chroma>/gi;
const chromaSrcRegex = /<chroma src="([^]*?)"([^]*?)>/gi;
const formatRegex = /(^\s+)/gm;

function compile(content: string): string {
	const pre = [...content.matchAll(chromaSrcRegex)];
	const code = [...content.matchAll(chromaRegex)];

	pre.map((chromaReg) => {
		const chromaString = chromaReg[0];
		let md;
		try {
			md = readFileSync(
				(chromaString.match(/"([^]*?)"/) as RegExpMatchArray)[0].split(
					'"'
				)[1],
				"utf-8"
			).replace(formatRegex, "");
		} catch (e) {
			console.error(
				`[Chroma] Failed to compile: The file '${chromaString.match(
					/"([^]*?)"/
				)}' was not found`
			);
			process.exit(1);
		}

		content = content.replace(
			chromaString,
			purify.sanitize(marked(md, { async: false }))
		);
	});

	code.map((chromaReg) => {
		const chromaString = chromaReg[0];

		while (content.indexOf(chromaString) !== -1) {
			const noTag = chromaString
				.replace(/<chroma>/gi, "")
				.replace(/<\/chroma>/gi, "")
				.replace(formatRegex, "");

			content = content
				.replace(
					chromaString,
					purify.sanitize(marked(noTag, { async: false }))
				)
				.replace(formatRegex, "");
		}
	});

	return content;
}

exports.default = compile;
export = compile;
