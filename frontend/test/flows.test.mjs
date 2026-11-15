import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';

// These flows cover the authored-sample mode; live translation needs the Python pipeline running.
process.env.NEXT_PUBLIC_TRANSLATE_MODE ??= 'sample';

test('Kebdti first-use, account, guest and translation flows use the test API',async t=>{
  const output=path.resolve('.test-output');fs.mkdirSync(output,{recursive:true});
  await build({entryPoints:['app/page.js'],outfile:path.join(output,'page.mjs'),bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.js':'jsx'},jsx:'automatic',logLevel:'silent'});
  const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'http://127.0.0.1:3001',pretendToBeVisual:true});
  for(const key of ['AbortController','AbortSignal','window','document','navigator','HTMLElement','HTMLInputElement','HTMLSelectElement','HTMLTextAreaElement','Element','SVGElement','Node','MutationObserver','CustomEvent','Event','MouseEvent','KeyboardEvent','localStorage','ShadowRoot'])Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true,writable:true});
  globalThis.getComputedStyle=dom.window.getComputedStyle.bind(dom.window);globalThis.requestAnimationFrame=dom.window.requestAnimationFrame.bind(dom.window);globalThis.cancelAnimationFrame=dom.window.cancelAnimationFrame.bind(dom.window);
  dom.window.matchMedia=query=>({matches:query.includes('reduced-motion'),media:query,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}});
  dom.window.HTMLElement.prototype.scrollTo=function(){};dom.window.HTMLElement.prototype.scrollIntoView=function(){};
  dom.window.speechSynthesis={cancel(){},getVoices(){return[];},speak(){}};
  Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:async()=>{throw new Error('Permission denied');}},configurable:true});
  let shared=null;Object.defineProperty(navigator,'share',{value:async data=>{shared=data;},configurable:true});
  const {NextRequest}=await import('next/server.js'),{GET,POST,PUT,DELETE}=await import('../app/api/test/[...path]/route.js');
  let cookie='';const calls=[];
  globalThis.fetch=async(url,options={})=>{
    const route=String(url),method=options.method||'GET';calls.push({route,method,body:options.body});
    const request=new NextRequest(`http://127.0.0.1:3001${route}`,{method,headers:{...options.headers,...(cookie?{cookie}:{})},...(options.body?{body:options.body}:{})});
    const handler={GET,POST,PUT,DELETE}[method];const response=await handler(request,{params:Promise.resolve({path:route.replace('/api/test/','').split('/')})});
    const session=response.headers.get('set-cookie');if(session)cookie=session.split(';')[0];return response;
  };
  const React=await import('react'),{render,screen,waitFor,cleanup}=await import('@testing-library/react'),{default:userEvent}=await import('@testing-library/user-event');
  const {default:Home}=await import(pathToFileURL(path.join(output,'page.mjs')).href);const user=userEvent.setup({document:dom.window.document});
  t.after(()=>{cleanup();dom.window.close();});t.afterEach(()=>{cleanup();localStorage.clear();cookie='';});
  async function start(){render(React.createElement(Home));await user.click(await screen.findByRole('button',{name:'Kebdti. Tap to continue'}));}
  async function enterAuth(){await start();await user.click(await screen.findByRole('button',{name:'Skip'},{timeout:6000}));await screen.findByRole('heading',{name:'Welcome back'},{timeout:6000});}
  async function completeSetup(name){await screen.findByRole('heading',{name:'What should we call you?'},{timeout:6000});const field=await screen.findByRole('textbox',{name:'Your name'},{timeout:6000});await user.clear(field);await user.type(field,name);await user.click(screen.getByRole('button',{name:'Continue',exact:true}));await screen.findByRole('heading',{name:'Who are you in the family?'},{timeout:6000});await user.click(screen.getByRole('button',{name:'Continue',exact:true}));await screen.findByRole('heading',{name:'Which languages?'},{timeout:6000});await user.click(screen.getByRole('button',{name:'Continue',exact:true}));await user.click(await screen.findByRole('radio',{name:/No, use a neutral voice/},{timeout:6000}));await user.click(screen.getByRole('button',{name:'Finish setup'}));await screen.findByRole('button',{name:'Start recording'},{timeout:6000});}

  await t.test('register → profile → explicit consent → sample → account history → restored session',async()=>{
    await enterAuth();await user.click(screen.getByRole('button',{name:'Create an account'}));
    await user.type(screen.getByRole('textbox',{name:'Your name'}),'Lina');await user.type(screen.getByRole('textbox',{name:'Email address'}),'lina@example.test');await user.type(screen.getByLabelText('Password',{exact:true}),'MadeUpPassword26!');await user.click(screen.getByRole('button',{name:'Create test account'}));
    await completeSetup('Lina');await user.click(screen.getByRole('button',{name:'Start recording'}));await screen.findByText(/Kebdti needs your microphone/);
    await user.click(screen.getByRole('button',{name:'Try a sample without recording'}));await screen.findByText(/Interface test sample. No AI translation/,{},{timeout:6000});
    assert.ok(calls.some(c=>c.route==='/api/test/translate'));assert.ok(!calls.some(c=>c.route==='/api/translate'));
    const upload=calls.find(c=>c.route==='/api/test/translate').body;assert.equal(upload.has('audio'),false);
    assert.equal(screen.queryByText(/For the things/),null);assert.match(document.activeElement.textContent,/sample translation/);
    const whatsapp=screen.getByRole('link',{name:'Send on WhatsApp'}),message=decodeURIComponent(new URL(whatsapp.href).searchParams.get('text'));assert.equal(new URL(whatsapp.href).origin,'https://wa.me');assert.match(message,/^\[Test sample\]/);assert.ok(!message.includes('original recording is attached'));assert.equal(shared,null);assert.ok(screen.getByText(/Opens WhatsApp with the translation as text\. This is a test sample\./));
    await user.click(screen.getByRole('button',{name:'Copy the text'}));assert.equal(await navigator.clipboard.readText(),message);
    await user.click(screen.getByRole('button',{name:'Profile',exact:true}));await user.click(await screen.findByRole('button',{name:'History',exact:true}));await screen.findByText('Sample');assert.ok(screen.getByText(/in your test account/));assert.equal(localStorage.getItem('kebdti-profile'),null);
    cleanup();await start();await screen.findByRole('button',{name:'Start recording'},{timeout:6000});assert.ok(screen.getByText('Lina'));
    await user.click(screen.getByRole('button',{name:'Profile',exact:true}));await user.click(await screen.findByRole('button',{name:'Sign out'}));await screen.findByRole('heading',{name:'Welcome back'},{timeout:6000});assert.equal(cookie.split('=')[1],'');
    cleanup();localStorage.clear();cookie='';
  });
  await t.test('guest setup is local and preview errors recover without inventing translations',async()=>{
    await enterAuth();await user.click(screen.getByRole('button',{name:'Continue without an account'}));await completeSetup('Fatna');assert.ok(JSON.parse(localStorage.getItem('kebdti-profile')));assert.equal(JSON.parse(localStorage.getItem('kebdti-profile')).voiceConsent,false);
    await user.click(screen.getByRole('button',{name:'Profile',exact:true}));await user.selectOptions(await screen.findByRole('combobox',{name:'Test translation scenario'}),'unclear');await user.click(screen.getByRole('button',{name:'Translate',exact:true}));await user.click(await screen.findByRole('button',{name:'Try a sample without recording'}));await screen.findByText(/couldn't hear that clearly/);
    await user.click(screen.getByRole('button',{name:'Profile',exact:true}));await user.selectOptions(await screen.findByRole('combobox',{name:'Test translation scenario'}),'offline');await user.click(screen.getByRole('button',{name:'Translate',exact:true}));await user.click(await screen.findByRole('button',{name:'Try a sample without recording'}));await screen.findByText(/test service is unavailable/);
    assert.equal(localStorage.getItem('kebdti-history'),null);cleanup();localStorage.clear();cookie='';
  });
  await t.test('skip on the sign-in screen goes straight into the app with a ready profile',async()=>{
    await enterAuth();await user.click(screen.getByRole('button',{name:'Skip and start translating'}));
    await screen.findByRole('button',{name:'Start recording'},{timeout:6000});
    const saved=JSON.parse(localStorage.getItem('kebdti-profile'));assert.equal(saved.role,'grandchild');assert.equal(saved.lang,'en');assert.equal(saved.familyLang,'dar');
    cleanup();localStorage.clear();cookie='';
  });
  await t.test('wrong password and test reset code flow recover the account',async()=>{
    await enterAuth();await user.type(screen.getByRole('textbox',{name:'Email address'}),'lina@example.test');await user.type(screen.getByLabelText('Password',{exact:true}),'WrongPassword');await user.click(screen.getByRole('button',{name:'Sign in',exact:true}));await screen.findByText(/email or test password is incorrect/);
    await user.click(screen.getByRole('button',{name:'Forgot password?'}));await user.click(screen.getByRole('button',{name:'Request reset code'}));const code=await screen.findByText(/^\d{6}$/);await user.type(screen.getByRole('textbox',{name:'Reset code'}),code.textContent);await user.type(screen.getByLabelText('New password'),'AnotherFakePassword26!');await user.click(screen.getByRole('button',{name:'Update password'}));await screen.findByText(/Password updated/);
    await user.type(screen.getByLabelText('Password',{exact:true}),'AnotherFakePassword26!');await user.click(screen.getByRole('button',{name:'Sign in',exact:true}));await screen.findByRole('button',{name:'Start recording'},{timeout:6000});assert.ok(screen.getByText('Lina'));cleanup();
  });
  await t.test('family expressions persist on-device and conversation prompts carry into recording',async()=>{
    await enterAuth();await user.click(screen.getByRole('button',{name:'Continue without an account'}));await completeSetup('Noor');
    await user.click(screen.getByRole('button',{name:'Between us',exact:true}));await user.click(await screen.findByRole('button',{name:'Add an expression'}));
    await user.type(screen.getByRole('textbox',{name:'The word or saying'}),'Lalla Noor');await user.type(screen.getByRole('textbox',{name:'What it means in our family'}),'Our little light');await user.type(screen.getByRole('textbox',{name:'Who says it? (optional)'}),'Grandma');await user.click(screen.getByRole('button',{name:'Keep this expression'}));
    await screen.findByText('Our little light');assert.equal(JSON.parse(localStorage.getItem('kebdti-family-words:guest'))[0].word,'Lalla Noor');
    await user.click(screen.getByRole('button',{name:'Profile',exact:true}));await user.click(screen.getByRole('button',{name:'Between us',exact:true}));await screen.findByText('Our little light');
    await user.click(screen.getByRole('button',{name:'Another conversation starter'}));await screen.findByText('A recipe worth keeping');await user.click(await screen.findByRole('button',{name:'Make a voice note'},{timeout:3000}));await screen.findByText('Ask about the dish that always brings the family together.');assert.ok(screen.getByRole('button',{name:'Start recording'}));
    await user.click(screen.getByRole('button',{name:'Between us',exact:true}));await user.click(await screen.findByRole('button',{name:'Word for word',exact:true}));await screen.findByText('“my liver”');await user.click(screen.getByRole('button',{name:'What they mean',exact:true}));await screen.findByText('“my darling, my heart”');
    await user.click(screen.getByRole('button',{name:'Between us',exact:true}));await user.click(await screen.findByRole('button',{name:'Remove Lalla Noor'}));await screen.findByText('Every family has its own language');assert.deepEqual(JSON.parse(localStorage.getItem('kebdti-family-words:guest')),[]);
  });
  await t.test('a received voice note opens for review, becomes a labelled sample, and can be answered',async()=>{
    const realCreate=URL.createObjectURL,realRevoke=URL.revokeObjectURL;URL.createObjectURL=()=>'blob:kebdti-test';URL.revokeObjectURL=()=>{};
    try{
      await enterAuth();await user.click(screen.getByRole('button',{name:'Continue without an account'}));await completeSetup('Yanis');
      await screen.findByRole('button',{name:'Open a voice note you received'});
      const input=document.querySelector('input[type="file"]'),loose=userEvent.setup({document:dom.window.document,applyAccept:false});
      await loose.upload(input,new dom.window.File(['hello'],'notes.txt',{type:'text/plain'}));await screen.findByText(/isn't a voice note/);assert.ok(screen.getByRole('button',{name:'Start recording'}));
      await loose.upload(input,new dom.window.File(['voice'],'PTT-20261114-WA0003.opus',{type:'audio/ogg'}));
      await screen.findByRole('heading',{name:'Voice note you received'});assert.ok(screen.getByText('They speak'));assert.equal(JSON.parse(localStorage.getItem('kebdti-langs')).from,'en');
      const before=calls.length;await user.click(screen.getByRole('button',{name:'Translate into English'}));await screen.findByText(/Interface test sample. No AI translation/,{},{timeout:6000});
      const sent=calls.slice(before).find(c=>c.route==='/api/test/translate');assert.ok(sent);assert.equal(sent.body.has('audio'),false);assert.equal(sent.body.get('from'),'dar');assert.equal(sent.body.get('to'),'en');assert.ok(!calls.some(c=>c.route==='/api/translate'));
      assert.match(document.activeElement.textContent,/They said, in .*sample translation/);
      await user.click(screen.getByRole('button',{name:/^Reply in/}));await screen.findByRole('heading',{name:'Record your reply'});assert.ok(screen.getByText('Replying to'));assert.ok(screen.getByText('You speak'));assert.ok(screen.getByRole('button',{name:'Start recording'}));
    }finally{URL.createObjectURL=realCreate;URL.revokeObjectURL=realRevoke;}
  });
  await t.test('leaving the recording page releases a microphone permission result that arrives late',async()=>{
    await enterAuth();await user.click(screen.getByRole('button',{name:'Continue without an account'}));await completeSetup('Noor');
    let permission,stopped=0;const devices=navigator.mediaDevices;
    Object.defineProperty(navigator,'mediaDevices',{value:{getUserMedia:()=>new Promise(resolve=>{permission=resolve;})},configurable:true});
    try{await user.click(screen.getByRole('button',{name:'Start recording'}));await screen.findByText('Waiting for microphone permission…');await user.click(screen.getByRole('button',{name:'Between us',exact:true}));await screen.findByRole('heading',{name:'Keep the words that feel like home'});permission({getTracks:()=>[{stop(){stopped++;}}]});await waitFor(()=>assert.equal(stopped,1));await user.click(screen.getByRole('button',{name:'Translate',exact:true}));await screen.findByRole('button',{name:'Start recording'});assert.equal(screen.queryByRole('button',{name:'Stop recording'}),null);}finally{Object.defineProperty(navigator,'mediaDevices',{value:devices,configurable:true});}
  });
});
