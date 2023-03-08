import { marked } from "marked";
import { DOMPurifyI } from "dompurify";

import regex from "./regex";

export default function parseChromaTags(content: RegExpMatchArray, clauseCode: boolean, purify: DOMPurifyI): string {
    let tabsToSpaces = "    ";
    const chromaReg = content;

    const chromaString = chromaReg[0];

    const noTag = chromaString
        .replace(regex.openingChromaTag, "")
        .replace(regex.closingChromaTag, "")
        .replace(regex.tabs, tabsToSpaces);

    let splitter = "\n";
    if (noTag.includes("\r\n")) {
        splitter = "\r\n";
    }

    let lines = noTag.split(splitter);
    let whiteSpace = 0;

    if (clauseCode) {
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
            throw Error(`[Chroma] Failed to compile! HTML File missing Clause Code: "|"`);
        }

        lines[clauseCodeIndex] = lines[clauseCodeIndex].replace("|", "");
    } else {
        const firstNoWhiteSpace = noTag.match(regex.noWhiteSpace);

        if (!firstNoWhiteSpace) {
            return "";
        } else {
            let done = false;

            for (let i = 0; i < lines.length; i++) {
                whiteSpace = 0;

                for (let j = 0; j < lines[i].length; j++) {
                    if (lines[i][j].match(regex.noWhiteSpace)) {
                        done = true;
                        break;
                    } else {
                        whiteSpace++;
                    }
                }

                if (done) {
                    break;
                }
            }
        }
    }

    lines.map((line, index) => {
        let whiteSpaceCount = 0;
        let firstChar;

        for (let i = 0; i < line.length; i++) {
            if (line[i].match(regex.noWhiteSpace)) {
                firstChar = i;
                break;
            }
        }

        if (firstChar === undefined) {
            firstChar = line.length - 1;
        }

        for (let i = 0; i < firstChar; i++) {
            if (whiteSpaceCount < whiteSpace && line[i].match(regex.whiteSpace)) {
                whiteSpaceCount++;
            }
        }

        lines[index] = lines[index].slice(whiteSpaceCount);
    });

    content[0] = content[0].replace(
        chromaString,
        purify.sanitize(marked(lines.join(splitter), { async: false }))
    );

    return content[0];
}