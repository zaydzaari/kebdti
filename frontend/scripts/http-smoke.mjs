import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.KEBDTI_TEST_URL||'http://127.0.0.1:3001';let cookie='';
async function api(route,{method='GET',body,expected=200}={}){const response=await fetch(base+'/api/test/'+route,{method,headers:{Origin:base,...(cookie?{Cookie:cookie}:{}),...(body&&!(body instanceof FormData)?{'Content-Type':'application/json'}:{})},...(body?{body:body instanceof FormData?body:JSON.stringify(body)}:{})});const data=await response.json();assert.equal(response.status,expected,JSON.stringify(data));if(response.headers.get('set-cookie'))cookie=response.headers.get('set-cookie').split(';')[0];return{data,response};}
const page=await fetch(base);assert.equal(page.status,200);assert.match(await page.text(),/Kebdti/);
assert.equal((await api('session')).data.user,null);
const input={name:'HTTP Tester',email:`http-${Date.now()}@example.test`,password:'LocalFakePassword26!'};
const created=await api('auth/register',{method:'POST',body:input});assert.ok(created.response.headers.get('set-cookie').includes('HttpOnly'));assert.ok(created.response.headers.get('set-cookie').includes('SameSite=strict'));assert.equal(created.data.token,undefined);
const profile={name:'HTTP Tester',role:'grandchild',lang:'fr',familyLang:'dar',voiceConsent:false};
await api('profile',{method:'PUT',body:profile});assert.equal((await api('session')).data.profile.voiceConsent,false);
const form=new FormData();form.set('from','dar');form.set('to','fr');const translated=(await api('translate',{method:'POST',body:form})).data;assert.equal(translated.mock,true);
await api('notes',{method:'POST',body:translated});assert.equal((await api('notes')).data.notes.length,1);
form.set('scenario','unclear');assert.equal((await api('translate',{method:'POST',body:form})).data.unclear,true);
form.set('scenario','offline');await api('translate',{method:'POST',body:form,expected:503});
const cross=await fetch(base+'/api/test/auth/logout',{method:'POST',headers:{Origin:'https://example.invalid',Cookie:cookie}});assert.equal(cross.status,403);
await api('auth/logout',{method:'POST'});assert.equal((await api('session')).data.user,null);await api('notes',{expected:401});
const receipt={page:true,registration:true,httpOnlySession:true,profile:true,consent:false,history:true,sampleTranslation:true,unclear:true,offline:true,crossOriginRejected:true,logout:true};fs.mkdirSync('.test-output',{recursive:true});fs.writeFileSync('.test-output/http-acceptance.json',JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
