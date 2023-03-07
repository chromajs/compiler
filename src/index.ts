import engine from './utils/engine.js';
import { format } from 'prettier';

compile(
  `
# Heading

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6


*italic*

**bold**

***bolditalic***

> Blockquote
Blockquote Continue

- ulist
- ulist
- ulist
- ulist
- ulist
`,
  'html'
);

export default function compile(src: string, lang: string): string {
  let res = format(engine(src), {
    parser: lang,
  }).trimEnd();

  console.log(res);
  return res;
}
