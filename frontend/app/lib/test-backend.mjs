import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { LANG } from './languages.js';

const scrypt=promisify(crypto.scrypt);
export class TestApiError extends Error { constructor(status,code,message){super(message);this.status=status;this.code=code;} }
const fail=(status,code,message)=>{throw new TestApiError(status,code,message);};
const text=(value,max=6000)=>typeof value==='string'?value.trim().slice(0,max):'';
const emailOf=value=>text(value,180).toLowerCase();
async function hash(password,salt=crypto.randomBytes(16).toString('hex')){return{salt,key:(await scrypt(password,salt,32)).toString('hex')};}
async function matches(password,stored){const value=await hash(password,stored.salt);return crypto.timingSafeEqual(Buffer.from(value.key,'hex'),Buffer.from(stored.key,'hex'));}
function passwordCheck(password){if(typeof password!=='string'||password.length<8||password.length>128)fail(400,'PASSWORD','Use a test password with 8–128 characters.');}
function emailCheck(email){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))fail(400,'EMAIL','Enter a valid email address.');}

const SAMPLE={
  dar:'كبدتي، توحشتك بزاف. فوقاش غادي تجي؟',
  fr:'Mon cœur, tu me manques beaucoup. Quand viendras-tu me voir ?',
  en:'My darling, I miss you so much. When will you come to see me?',
  es:'Cariño, te echo mucho de menos. ¿Cuándo vendrás a verme?',
  nl:'Mijn lief, ik mis je zo. Wanneer kom je me bezoeken?',
  de:'Mein Schatz, du fehlst mir sehr. Wann kommst du mich besuchen?',
  it:'Tesoro mio, mi manchi tanto. Quando verrai a trovarmi?',
  ar:'يا حبيبي، أشتاق إليك كثيرًا. متى ستأتي لزيارتي؟',
};

export function createTestBackend({now=Date.now}={}) {
  const users=new Map(),sessions=new Map(),resets=new Map();
  const ready=hash('FamilyDemo26!').then(password=>users.set('family@kebdti.test',{id:crypto.randomUUID(),name:'Yanis',email:'family@kebdti.test',password,profile:null,notes:[]}));
  const publicUser=user=>({id:user.id,name:user.name,email:user.email});
  function userFor(token,required=true){const session=sessions.get(token);if(!session||session.expires<=now()){sessions.delete(token);if(required)fail(401,'SESSION_EXPIRED','Your session ended. Sign in again.');return null;}const user=users.get(session.email);if(!user&&required)fail(401,'SESSION_EXPIRED','Sign in again.');return user;}
  function issue(user){const token=crypto.randomBytes(32).toString('hex');sessions.set(token,{email:user.email,expires:now()+8*60*60*1000});return{token,user:publicUser(user),profile:structuredClone(user.profile)};}
  return {
    async session(token){await ready;const user=userFor(token,false);return{backend:'test',user:user?publicUser(user):null,profile:user?structuredClone(user.profile):null};},
    async register(input){await ready;const email=emailOf(input.email),name=text(input.name,40);emailCheck(email);passwordCheck(input.password);if(name.length<2)fail(400,'NAME','Enter a name with at least two characters.');if(users.has(email))fail(409,'EMAIL_EXISTS','That test account already exists. Try signing in.');const user={id:crypto.randomUUID(),name,email,password:await hash(input.password),profile:null,notes:[]};users.set(email,user);return issue(user);},
    async login(input){await ready;const email=emailOf(input.email);const user=users.get(email);if(typeof input.password!=='string'||input.password.length>128||!user||!await matches(input.password,user.password))fail(401,'INVALID_CREDENTIALS','The email or test password is incorrect.');return issue(user);},
    async logout(token){sessions.delete(token);return{ok:true};},
    async saveProfile(token,input){await ready;const user=userFor(token),name=text(input.name,40);if(!name||!['grandparent','grandchild','family'].includes(input.role)||!LANG[input.lang]||!LANG[input.familyLang]||input.lang===input.familyLang||typeof input.voiceConsent!=='boolean')fail(400,'PROFILE','Check your name, languages and consent choice.');user.name=name;user.profile={name,role:input.role,lang:input.lang,familyLang:input.familyLang,voiceConsent:input.voiceConsent,createdAt:user.profile?.createdAt||now()};return{profile:structuredClone(user.profile)};},
    async notes(token){await ready;return{notes:structuredClone(userFor(token).notes)};},
    async addNote(token,input){await ready;const user=userFor(token);if(!LANG[input.from]||!LANG[input.to]||input.from===input.to||!text(input.translation))fail(400,'NOTE','The translated note is incomplete.');const note={id:crypto.randomUUID(),at:now(),from:input.from,to:input.to,heard:text(input.heard),translation:text(input.translation),translit:text(input.translit),literal:text(input.literal),note:text(input.note),feelings:Array.isArray(input.feelings)?input.feelings.slice(0,8).map(v=>text(v,80)).filter(Boolean):[],mock:true,testBackend:true};user.notes=[note,...user.notes].slice(0,50);return{note,notes:structuredClone(user.notes)};},
    async removeNote(token,id){await ready;const user=userFor(token);user.notes=user.notes.filter(note=>note.id!==id);return{notes:structuredClone(user.notes)};},
    async clearData(token){await ready;const user=userFor(token);user.profile=null;user.notes=[];return{ok:true};},
    async requestReset(input){await ready;const email=emailOf(input.email);emailCheck(email);let testCode=null;if(users.has(email)){testCode=String(crypto.randomInt(100000,1000000));resets.set(email,{code:testCode,expires:now()+10*60*1000,attempts:0});}return{message:'If this test account exists, a reset code is ready. No email is sent.',testCode};},
    async confirmReset(input){await ready;const email=emailOf(input.email),reset=resets.get(email);passwordCheck(input.password);if(!reset||reset.expires<=now()||++reset.attempts>5||typeof input.code!=='string'||!/^\d{6}$/.test(input.code)||input.code!==reset.code)fail(400,'RESET_CODE','That code is incorrect or expired. Request a new one.');const user=users.get(email);user.password=await hash(input.password);resets.delete(email);for(const [token,s]of sessions)if(s.email===email)sessions.delete(token);return{ok:true};},
    translate({from,to,scenario='success'}){if(!LANG[from]||!LANG[to]||from===to)fail(400,'LANGUAGE_PAIR','Choose two different languages.');if(scenario==='offline')fail(503,'TEST_UNAVAILABLE','The test service is unavailable. Switch the preview scenario or try again.');if(scenario==='unclear')return{ok:true,mock:true,backend:'test',unclear:true,from,to};return{ok:true,mock:true,backend:'test',from,to,heard:SAMPLE[from],translation:SAMPLE[to],translit:to==='dar'?'Kebdti, twe7chtek bzaf. Fouqach ghadi tji?':'',literal:from==='dar'&&to==='fr'?'Mon foie, tu me manques beaucoup. Quand vas-tu venir ?':'',feelings:['Affection','Longing'],note:'Authored test fixture: “kebdti” is an affectionate Darija expression. This sample does not transcribe or evaluate your recording.',ttsLang:LANG[to].tts,voiceMode:'browser-neutral'};},
  };
}
const key=Symbol.for('kebdti.test-backend.v1');
export const testBackend=globalThis[key]||(globalThis[key]=createTestBackend());
