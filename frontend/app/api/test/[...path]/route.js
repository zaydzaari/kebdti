import { NextResponse } from 'next/server.js';
import { testBackend } from '../../../lib/test-backend.mjs';
import { LIVE_TRANSLATE, liveTranslate } from '../../../lib/kebdti-pipeline.mjs';

export const runtime='nodejs';
export const dynamic='force-dynamic';
const COOKIE='kebdti-test-session';
async function handle(request,{params}) {
  if(process.env.NEXT_PUBLIC_BACKEND_MODE==='live')return NextResponse.json({message:'Test backend is disabled.'},{status:404});
  const origin=request.headers.get('origin');
  // Next's development server can normalize request.url to localhost even
  // when the browser visits 127.0.0.1. Host retains the browser-facing host.
  const url=new URL(request.url);
  const requestOrigin=`${url.protocol}//${request.headers.get('host')||url.host}`;
  if(origin && origin!==requestOrigin)return NextResponse.json({message:'Same-origin requests only.'},{status:403});
  params=await params;
  const route=params.path.join('/'),token=request.cookies.get(COOKIE)?.value,method=request.method;
  try{
    let data={},sessionCookie;
    const json=async()=>{if(!request.headers.get('content-type')?.includes('application/json'))throw Object.assign(new Error('Send JSON for this request.'),{status:415});try{return await request.json();}catch{throw Object.assign(new Error('Send valid JSON for this request.'),{status:400});}};
    if(method==='GET'&&route==='session')data=await testBackend.session(token);
    else if(method==='POST'&&['auth/login','auth/register'].includes(route)){data=await testBackend[route.endsWith('register')?'register':'login'](await json());sessionCookie=data.token;delete data.token;}
    else if(method==='POST'&&route==='auth/logout'){data=await testBackend.logout(token);sessionCookie='';}
    else if(method==='POST'&&route==='auth/reset/request')data=await testBackend.requestReset(await json());
    else if(method==='POST'&&route==='auth/reset/confirm')data=await testBackend.confirmReset(await json());
    else if(method==='PUT'&&route==='profile')data=await testBackend.saveProfile(token,await json());
    else if(method==='GET'&&route==='notes')data=await testBackend.notes(token);
    else if(method==='POST'&&route==='notes')data=await testBackend.addNote(token,await json());
    else if(method==='DELETE'&&/^notes\/[^/]+$/.test(route))data=await testBackend.removeNote(token,params.path[1]);
    else if(method==='DELETE'&&route==='data')data=await testBackend.clearData(token);
    else if(method==='POST'&&route==='translate'){
      if(Number(request.headers.get('content-length')||0)>12*1024*1024)throw Object.assign(new Error('Use a recording smaller than 12 MB.'),{status:413});const form=await request.formData();
      const live=LIVE_TRANSLATE?await liveTranslate(form):null;
      if(live)return NextResponse.json({...live,backend:'kebdti'},{headers:{'Cache-Control':'no-store'}});
      data=testBackend.translate({from:form.get('from'),to:form.get('to'),scenario:form.get('scenario')||'success'});
    }else return NextResponse.json({message:'Test endpoint not found.'},{status:404});
    const response=NextResponse.json({...data,backend:'test'},{headers:{'Cache-Control':'no-store'}});
    if(sessionCookie!==undefined)response.cookies.set(COOKIE,sessionCookie,{httpOnly:true,sameSite:'strict',secure:new URL(request.url).protocol==='https:',path:'/',maxAge:sessionCookie?8*60*60:0});
    return response;
  }catch(error){return NextResponse.json({ok:false,code:error.code||'TEST_ERROR',message:error.status?error.message:'The test service could not complete this request.'},{status:error.status||500,headers:{'Cache-Control':'no-store'}});}
}
export {handle as GET,handle as POST,handle as PUT,handle as DELETE};
