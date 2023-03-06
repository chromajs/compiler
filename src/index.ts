import { readFileSync } from "fs";
import { marked } from "marked";
import dompurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = dompurify(window as unknown as Window);

const chromaRegex = /<chroma>([^]*?)<\/chroma>/gi;
const chromaSrcRegex = /<chroma src="([^]*?)"([^]*?)>/gi;

function compile(content: string, tabSpace?: number): string {
    if (!tabSpace) {
        tabSpace = 4;
    }

    let tabsToSpaces = "";
    for (let i = 0; i < tabSpace; i++) {
        tabsToSpaces += " ";
    }

    const pre = [...content.matchAll(chromaSrcRegex)];
    const code = [...content.matchAll(chromaRegex)];

    pre.map(chromaReg => {
        const chromaString = chromaReg[0];
        let md;
        try {
            md = readFileSync((chromaString.match(/"([^]*?)"/) as RegExpMatchArray)[0].split("\"")[1], "utf-8");
        } catch (e) {
            console.log("[Chroma] Failed to compile! Chroma SRC Markdown File does not exist!");
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
                .replace(/\t/gi, tabsToSpaces);

            let splitter = "\n";
            if (noTag.includes("\r\n")) {
                splitter = "\r\n";
            }

            let lines = noTag.split(splitter);
            let whiteSpace = 0;
            let clauseCodeIndex;
            for (let i = 0; i < lines.length; i++) {
                whiteSpace = 0;

                const line = lines[i];
                let found = false;
                for (let j = 0; j < line.length; j++) {
                    if (line[j] === "|") {
                        clauseCodeIndex = i;
                        found = true;
                        break;
                    } else {
                        whiteSpace++;
                    }
                }

                if (found) {
                    break;
                }
            }

            if (clauseCodeIndex === undefined) {
                console.log(`[Chroma] Failed to compile! HTML File missing Clause Code: "|"`);
                process.exit(1);
            }

            lines[clauseCodeIndex] = lines[clauseCodeIndex].replace("|", "");

            lines.map((line, index) => {
                let whiteSpaceCount = 0;
                let firstChar;

                for (let i = 0; i < line.length; i++) {
                    if (!line[i].match(/ |\n|\r|\t/)) {
                        firstChar = i;
                        break;
                    }
                }
                //console.log(firstChar);

                if (!firstChar) {
                    firstChar = line.length - 1;
                }

                for (let i = 0; i < firstChar; i++) {
                    if (whiteSpaceCount < whiteSpace && line[i].match(/ |\n|\r|\t/)) {
                        whiteSpaceCount++;
                    }
                }

                lines[index] = lines[index].slice(whiteSpaceCount);
            });

            content = content.replace(
                chromaString,
                purify.sanitize(marked(lines.join(splitter), { async: false }))
            );
        }
    });

    return content;
}

exports.default = compile;
export = compile;