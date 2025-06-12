const nouns = new Set(['dog','cat','boy','girl','teacher','student','story','sun','tree','food','park','friend','bird','book','bicycle','house','library','family','class','assignment','weather']);
const verbs = new Set(['is','was','are','run','runs','ran','eat','eats','ate','read','reads','write','writes','play','plays','draw','draws','build','builds','go','goes','went','make','makes','made','kick','kicks','chase','chases']);
const adjectives = new Set(['huge','small','red','blue','warm','quiet','empty','fast','bright','tasty','kind','gentle','colorful','tall','green','cold','champion']);
const adverbs = new Set(['quickly','slowly','happily','quietly','brightly','cheerfully','eagerly']);

export function getWordClass(word) {
  const clean = word.toLowerCase().replace(/[.!?]/g, '');
  if (adverbs.has(clean) || clean.endsWith('ly')) return 'adverb';
  if (verbs.has(clean)) return 'verb';
  if (adjectives.has(clean)) return 'adjective';
  if (nouns.has(clean) || /^[A-Z]/.test(word)) return 'noun';
  return 'other';
}
export function getWordRole(word,index,correctArray) {
  if(index===0) return 'subject';
  if(index===1) return 'verb';
  if(index>1 && index<correctArray.length-1) return 'object';
  return 'end';
}
