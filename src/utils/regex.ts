export default {
    chromaTag: /<chroma>([^]*?)<\/chroma>/gi,
    srcChromaTags: /<chroma src="([^]*?)"([ ]*?)\/>/gi,
    clauseCode: /|/,
    noWhiteSpace: /\S/,
    whiteSpace: /\s/,
    openingChromaTag: /<chroma>/gi,
    closingChromaTag: /<\/chroma>/gi,
    tabs: /\t/gi,
    src: /"([^]*?)"/,
}