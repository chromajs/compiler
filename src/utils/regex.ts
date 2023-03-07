export let heading = /#{1,6}[ ].*$/gim,
  boldItalic = /\*{3}(.*?)\*{3}/gim,
  bold = /\*{2}(.*?)\*{2}/gim,
  italic = /\*{1}(.*?)\*{1}/gim,
  quote = /(^> .*?\n{2})/gims;
