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
    console.log(i[0]);

    src = src.replace(
      i[0],
      i[0].replace('> ', '<blockquote>').concat('</blockquote>\n\n')
    );
  });

  [...src.matchAll(regex.ulistBlock)].map(i => {
    src = src.replace(i[0], '<ul>' + i[0] + '</ul>');
  });

  [...src.matchAll(regex.ulist)].map(i => {
    src = src.replace(
      i[0],
      i[0].replace('- ', '<li>').replace('\n', '</li>\n')
    );
  });

  return src;
}
