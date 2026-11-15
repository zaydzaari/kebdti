export const TEST_BACKEND=process.env.NEXT_PUBLIC_BACKEND_MODE!=='live';
// Real translation (speech recognition + GPT-6 Luna + voice) even while accounts use the test backend.
export const LIVE_TRANSLATE=process.env.NEXT_PUBLIC_TRANSLATE_MODE!=='sample';
export const SAMPLE_MODE=TEST_BACKEND&&!LIVE_TRANSLATE;
const base=TEST_BACKEND?'/api/test':(process.env.NEXT_PUBLIC_API_BASE_URL||'/api').replace(/\/$/,'');
async function request(path,{method='GET',body,signal}={}) {
  const form=typeof FormData!=='undefined'&&body instanceof FormData;
  const response=await fetch(`${base}/${path}`,{method,credentials:'include',cache:'no-store',signal,...(body?{headers:form?{}:{'Content-Type':'application/json'},body:form?body:JSON.stringify(body)}:{})});
  let data;try{data=await response.json();}catch{throw new Error('The service returned an unreadable response. Try again.');}
  if(!response.ok){const error=new Error(data.message||'Something went wrong. Try again.');error.status=response.status;error.code=data.code;throw error;}return data;
}
export const backend={
  session:()=>request('session'),login:input=>request('auth/login',{method:'POST',body:input}),register:input=>request('auth/register',{method:'POST',body:input}),logout:()=>request('auth/logout',{method:'POST'}),
  requestReset:input=>request('auth/reset/request',{method:'POST',body:input}),confirmReset:input=>request('auth/reset/confirm',{method:'POST',body:input}),
  saveProfile:profile=>request('profile',{method:'PUT',body:profile}),notes:()=>request('notes'),addNote:note=>request('notes',{method:'POST',body:note}),removeNote:id=>request(`notes/${encodeURIComponent(id)}`,{method:'DELETE'}),clearData:()=>request('data',{method:'DELETE'}),
  translate:(form,signal)=>request('translate',{method:'POST',body:form,signal}),
};
