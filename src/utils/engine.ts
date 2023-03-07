import * as regex from './regex.js';

export default function engine(src: string): string {
  src = src + '\n\n';

  [...src.matchAll(regex.heading)].map(i => {
    src = src.replace(
      i[0],
      i[0].replace(/#{1,6}[ ]/, `<h${(i[0].match(/#/g) || []).length}>`) +
        `</h${(i[0].match(/#/g) || []).length}>`
    );
  });

  [...src.matchAll(regex.boldItalic)].map(i => {
    src = src.replace(
      i[0],
      i[0].replace('***', '<b><em>').replace('***', '</em></b>')
    );
  });

  [...src.matchAll(regex.bold)].map(i => {
    src = src.replace(i[0], i[0].replace('**', '<b>').replace('**', '</b>'));
  });

  [...src.matchAll(regex.italic)].map(i => {
    src = src.replace(i[0], i[0].replace('*', '<em>').replace('*', '</em>'));
  });

  [...src.matchAll(regex.quote)].map(i => {
    src = src.replace(
      i[0],
      i[0].replace('> ', '<blockquote>').replace('\n\n', '</blockquote>\n\n')
    );
  });

  return src;
}
