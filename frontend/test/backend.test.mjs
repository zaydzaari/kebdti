import test from 'node:test';
import assert from 'node:assert/strict';
import { createTestBackend } from '../app/lib/test-backend.mjs';
const account=(email='yanis@example.test')=>({name:'Yanis',email,password:'FakePassword26!'});
const profile={name:'Yanis',role:'grandchild',lang:'fr',familyLang:'dar',voiceConsent:false};

test('registration, login and expiring sessions behave as an actual test service',async()=>{
  let clock=1000;const service=createTestBackend({now:()=>clock});
  const user=await service.register(account());assert.ok(user.token);assert.equal(user.user.email,'yanis@example.test');assert.equal(user.user.password,undefined);
  await assert.rejects(()=>service.register(account()),{code:'EMAIL_EXISTS'});
  await assert.rejects(()=>service.login({...account(),password:'WrongPassword'}),{code:'INVALID_CREDENTIALS'});
  assert.equal((await service.session(user.token)).user.id,user.user.id);
  clock+=8*60*60*1000+1;assert.equal((await service.session(user.token)).user,null);
  await assert.rejects(()=>service.notes(user.token),{code:'SESSION_EXPIRED'});
  const login=await service.login(account());await service.logout(login.token);assert.equal((await service.session(login.token)).user,null);
});
test('profiles, consent and notes are isolated between two accounts',async()=>{
  const service=createTestBackend(),a=await service.register(account()),b=await service.register(account('fatna@example.test'));
  await service.saveProfile(a.token,profile);assert.equal((await service.session(a.token)).profile.voiceConsent,false);assert.equal((await service.session(b.token)).profile,null);
  await assert.rejects(()=>service.saveProfile(a.token,{...profile,familyLang:'fr'}),{code:'PROFILE'});
  await service.addNote(a.token,{from:'dar',to:'fr',translation:'Mon cœur',heard:'Kebdti',feelings:['Affection']});
  const notes=(await service.notes(a.token)).notes;assert.equal(notes.length,1);assert.equal(notes[0].mock,true);assert.equal((await service.notes(b.token)).notes.length,0);
  await service.removeNote(b.token,notes[0].id);assert.equal((await service.notes(a.token)).notes.length,1);
  await service.clearData(a.token);assert.equal((await service.notes(a.token)).notes.length,0);assert.equal((await service.session(a.token)).profile,null);
});
test('test password recovery uses an expiring one-time code and revokes old sessions',async()=>{
  let clock=1;const service=createTestBackend({now:()=>clock}),a=await service.register(account());
  const requested=await service.requestReset(account());assert.match(requested.testCode,/^\d{6}$/);
  await assert.rejects(()=>service.confirmReset({...account(),code:'000000'}),{code:'RESET_CODE'});
  await service.confirmReset({email:account().email,code:requested.testCode,password:'ChangedPassword26!'});
  assert.equal((await service.session(a.token)).user,null);await assert.rejects(()=>service.login(account()),{code:'INVALID_CREDENTIALS'});
  assert.ok((await service.login({...account(),password:'ChangedPassword26!'})).token);
  await assert.rejects(()=>service.confirmReset({...account(),code:requested.testCode}),{code:'RESET_CODE'});
  const expired=await service.requestReset(account());clock+=10*60*1000+1;await assert.rejects(()=>service.confirmReset({...account(),code:expired.testCode}),{code:'RESET_CODE'});
});
test('test translations are honest fixtures, support all pairs, and expose unclear/offline states',()=>{
  const service=createTestBackend();for(const to of ['fr','en','es','nl','de','it','ar']){const result=service.translate({from:'dar',to});assert.equal(result.mock,true);assert.equal(result.backend,'test');assert.ok(result.translation);assert.equal(result.voiceMode,'browser-neutral');}
  assert.equal(service.translate({from:'fr',to:'dar',scenario:'unclear'}).unclear,true);
  assert.throws(()=>service.translate({from:'dar',to:'fr',scenario:'offline'}),{status:503});assert.throws(()=>service.translate({from:'fr',to:'fr'}),{code:'LANGUAGE_PAIR'});
});
