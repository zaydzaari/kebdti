// Authored prompts; these are conversation invitations, not AI-generated advice.
export const STARTERS = [
  {id:'small-day',topic:'Everyday things',title:'The little things count',question:'What was the nicest part of your day?',lead:'Tell them one small thing that made you smile today.',tag:'A small hello'},
  {id:'recipe',topic:'Around the table',title:'A recipe worth keeping',question:'What did your mother cook when the whole family came over?',lead:'Ask about the dish that always brings the family together.',tag:'A taste of home'},
  {id:'childhood',topic:'Before my time',title:'Before I knew you',question:'What were you like when you were my age?',lead:'Ask them to tell you one story from when they were your age.',tag:'A family story'},
  {id:'miss',topic:'Missing each other',title:'A little less far away',question:'What is one thing you wish we could do together this week?',lead:'Tell them what you miss doing together.',tag:'Across the distance'},
  {id:'word',topic:'Family words',title:'The name only you use',question:'Who gave me my family nickname, and why?',lead:'Ask where a family nickname came from.',tag:'Only between us'},
  {id:'proud',topic:'Something to share',title:'Let them be part of it',question:'What is something you did this week that you want me to know about?',lead:'Share a small win you would like them to be part of.',tag:'A little good news'},
];
const key=owner=>`kebdti-family-words:${owner||'guest'}`;
export function readFamilyWords(owner){try{const value=JSON.parse(localStorage.getItem(key(owner))||'[]');return Array.isArray(value)?value.filter(v=>typeof v.id==='string'&&typeof v.word==='string'&&typeof v.meaning==='string').slice(0,30):[];}catch{return[];}}
export function writeFamilyWords(owner,words){try{localStorage.setItem(key(owner),JSON.stringify(words));return true;}catch{return false;}}
export function clearFamilyWords(owner){try{localStorage.removeItem(key(owner));}catch{}}
