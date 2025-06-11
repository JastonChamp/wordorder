export const nouns = new Set([
  'dog','cat','boy','girl','teacher','student','party','ball','story','sun','tree','food','house','park','friend','bird','book','bicycle','mom','dad','library','family','class','assignment','weather'
]);

export const verbs = new Set([
  'is','was','were','are','runs','run','ran','eats','eat','sings','sing','sleeps','sleep','reads','read','writes','write','explained','listen','listened','chased','had','have','play','plays','draws','draw','decided','enjoyed','prepared','helped','finished','stopped','jumps','jump','builds','build','climbs','climb','solves','solve','shares','share','flies','fly','falls','fall','barks','bark','purrs','purr','rides','ride','skips','skip','claps','clap','fetch','wags','wag','does','do','did','will','shall','can','might','should','would','arrived','studied','continued','greeted','celebrated'
]);

export const adjectives = new Set([
  'huge','small','red','blue','warm','quiet','empty','fast','bright','tasty','kind','gentle','colorful','tall','green','sweet','delightful','happy','late','cool','challenging','difficult','quiet','eager','remarkable','warmly','excellent','engaging'
]);

export const adverbs = new Set([
  'quickly','slowly','happily','quietly','warmly','brightly','kindly','gently','fast','loudly','softly','cheerfully','eagerly'
]);

export function getWordClass(word) {
  const clean = word.toLowerCase().replace(/[.!?]/g, '');
  if (adverbs.has(clean) || clean.endsWith('ly')) return 'adverb';
  if (verbs.has(clean)) return 'verb';
  if (adjectives.has(clean)) return 'adjective';
  if (nouns.has(clean) || /^[A-Z]/.test(word)) return 'noun';
  return 'other';
}
