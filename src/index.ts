import engine from './utils/engine.js';
import { format } from 'prettier';

export default function compile(src: string, lang?: string): string {
  return format(engine(src), { parser: lang ? lang : 'html' }).trimEnd();
}
