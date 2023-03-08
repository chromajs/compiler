import { marked } from "marked";
import dompurify from "dompurify";
import { JSDOM } from "jsdom";
import { readFileSync } from "fs";

import regex from "./utils/regex";
import parseChromaTags from "./utils/parseChromaTags";

const window = new JSDOM("").window;
const purify = dompurify(window as unknown as Window);

function compile(src: string) {
    [...src.matchAll(regex.srcChromaTags)].map((chromaTag) => {
        const chromaString = chromaTag[0];
        let md;
        try {
            md = readFileSync((chromaString.match(regex.src) as RegExpMatchArray)[0].split("\"")[1], "utf-8");
        } catch (e) {
            throw Error("[Chroma] Failed to compile! Chroma SRC Markdown File does not exist!");
        }

        src = src.replace(
            chromaString,
            purify.sanitize(marked(md, { async: false }))
        );
    });

    [...src.matchAll(regex.chromaTag)].map((chromaTag) => {
        const chromaString = chromaTag[0];
        const clauseCode = chromaString.match(regex.clauseCode);
        let useClauseCode = false;

        if (clauseCode) {
            if ((chromaString.indexOf("|")) - 1 > -1) {
                if (chromaString[chromaString.indexOf("|") - 1] !== "\\") {
                    useClauseCode = true;
                }
            }
        }

        src = src.replace(regex.chromaTag, parseChromaTags(chromaTag, useClauseCode, purify));
    });

    return src;
}

exports.default = compile;
export = compile;
