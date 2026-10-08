// ======================================================================
// @@FIREBASE   Firebase connection (config, auth, database)
//   Edit here to change the Firebase project.
// ======================================================================
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth,GoogleAuthProvider,signInWithPopup,signInWithEmailAndPassword,createUserWithEmailAndPassword,sendPasswordResetEmail,confirmPasswordReset,verifyPasswordResetCode,fetchSignInMethodsForEmail,onAuthStateChanged,signOut,deleteUser,sendEmailVerification} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {initializeFirestore,doc,getDoc,runTransaction,serverTimestamp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
const app=initializeApp({apiKey:"AIzaSyB7WRLBVRufPnlFck0dreWcU8-yWh9f7_0",authDomain:"ultimate-tour-1.firebaseapp.com",projectId:"ultimate-tour-1",storageBucket:"ultimate-tour-1.firebasestorage.app",messagingSenderId:"593726515356",appId:"1:593726515356:web:bafe179aed7d77015be559"});
const auth=getAuth(app),db=initializeFirestore(app,{experimentalForceLongPolling:true}),q=s=>document.querySelector(s),v=i=>q('#su_'+i).value.trim();

// ======================================================================
// @@STATE   Page references, rules (email/name), flags, message table E
//   Add or reword any red/green message in E.
// ======================================================================
const lgF=q('#login .lg'),sgF=q('#sgf'),home=q('#home'),pwF=['#su_pw1','#su_pw2'].map(i=>q(i).closest('.field'));
const MAIL=/^\S+@\S+\.\S+$/,NAME=/^[\p{L}][\p{L}\p{M}\s.'-]{1,59}$/u;
let pending=null,working=false,UI=false;
const VERIFIED=new URLSearchParams(location.search).get('verified')==='1';
let GFLAG=false;try{GFLAG=sessionStorage.getItem('ut_g')==='1';sessionStorage.removeItem('ut_g')}catch(e){}
const NOAUTO=VERIFIED||GFLAG||new URLSearchParams(location.search).get('reset')==='done'||new URLSearchParams(location.search).has('oobCode');
if(NOAUTO)AUTO.state='login';
const E={'auth/invalid-credential':'Wrong email or password','auth/wrong-password':'Wrong password','auth/user-not-found':'No account found','auth/invalid-email':'Enter a valid email','auth/email-already-in-use':'Email already registered. Log in instead','auth/weak-password':'Password must be at least 6 characters','auth/too-many-requests':'Too many tries. Wait a bit and retry','auth/network-request-failed':'No internet connection','auth/unauthorized-domain':'Domain not authorized in Firebase','auth/unauthorized-continue-uri':'Domain not authorized in Firebase','app/username-taken':'Username already taken. Try another','app/not-verified':'Not verified yet. Open the Gmail link first','auth/invalid-action-code':'Link invalid or already used','auth/expired-action-code':'Link expired. Send a new one','app/no-profile':'Account not found. Create a new account','app/name':'Enter a valid full name','app/name-empty':'Enter your full name','app/use-google':'Log in to this account with Google','app/username-empty':'Enter your username','app/email-empty':'Enter your Gmail','app/pw-empty':'Enter your password','app/pw-new-empty':'Enter a password','app/pw2-empty':'Confirm your password','app/username':'Username: 3-20 letters, numbers, . or _','app/phone':'Enter a valid phone number','app/pw-match':'Passwords do not match','permission-denied':'Permission denied. Check Firestore rules'};

// ======================================================================
// @@HELPER-MESSAGES   Message line above buttons: say(), error text, failAnim()
//   The ball "writes" messages here.
// ======================================================================
const say=(root,t,ok)=>{let p=root.querySelector('.slot');if(!p){p=document.createElement('p');p.className='msg slot';root.querySelector('.btn').before(p)}p.textContent=t||'';p.style.clipPath='';p.style.color=ok?'#1e4d3a':'#d6452a'};
const errText=e=>E[e.code]||'Something went wrong ('+(e.code||e.message)+')';
async function failAnim(btn,root,text){const slot=root.querySelector('.slot');if(!slot){say(root,text);return}
  const g=gAnim(btn,true);try{await g.eat();await new Promise(r=>setTimeout(r,350));await g.fail(text,slot)}catch(x){g.reset();say(root,text)}}

// ======================================================================
// @@HELPER-BUTTONS   Button helpers: restoreBtn, countdown (cdStart), btnWrite
//   Create / Send-link countdown lives here.
// ======================================================================
// A pill button left blank by its gather animation gets its dot and text back
function restoreBtn(b){b.querySelectorAll('.gsp').forEach(x=>x.remove());const i=b.querySelector('i'),t=b.querySelector('span');
  gsap.killTweensOf([i,t]);gsap.set([i,t],{x:0,scale:1,opacity:1});t.style.clipPath='';b.style.overflow=b.style.position=''}
// Cooldown on a button: label shows a live countdown (e.g. Create 79s); clicking early shakes the label
function cdMarkup(tx,base,txt){tx.textContent=base;const cd=document.createElement('em');cd.className='cdt';cd.textContent=txt;tx.append(cd);return cd}
function cdStart(btn,sec,base){const tx=btn.querySelector('span');clearInterval(btn._i);btn._at=Date.now()+sec*1000;
  const cd=cdMarkup(tx,base,'');
  const tick=()=>{const n=Math.ceil((btn._at-Date.now())/1000);
    if(n>0){cd.textContent=' '+n+'s';return}
    clearInterval(btn._i);btn._at=0;
    gsap.to(cd,{width:0,opacity:0,duration:.7,ease:'power3.inOut',onComplete:()=>{tx.textContent=base}})};
  tick();btn._i=setInterval(tick,250)}
const cdReady=btn=>!btn._at||Date.now()>=btn._at;
// The ball comes back, writes the label with the timer, and settles into the dot's place
async function btnWrite(btn,base,sec){
  UI=true;
  try{
    restoreBtn(btn);
    const lg=btn.querySelector('i'),tx=btn.querySelector('span');
    cdMarkup(tx,base,' '+sec+'s');gsap.set(lg,{opacity:0});tx.style.clipPath='inset(0 100% 0 0)';
    const B=btn.getBoundingClientRect(),L=lg.getBoundingClientRect(),T=tx.getBoundingClientRect(),cx=B.left+B.width/2,cy=B.top+B.height/2;
    const bl=document.createElement('div');
    Object.assign(bl.style,{position:'fixed',left:cx-7+'px',top:cy-7+'px',width:'14px',height:'14px',borderRadius:'50%',background:'#c9de3c',zIndex:96,pointerEvents:'none'});
    document.body.append(bl);gsap.set(bl,{scale:.2,opacity:0});
    await fin(gsap.to(bl,{scale:1,opacity:1,duration:.3,ease:'back.out(2)'}));
    await fin(gsap.to(bl,{left:T.left-7,duration:.45,ease:'power3.inOut'}));
    const o={v:T.left};
    await fin(gsap.to(o,{v:T.right,duration:Math.min(1.2,.3+tx.textContent.length*.03),ease:'none',onUpdate:()=>{tx.style.clipPath='inset(0 '+(T.right-o.v)+'px 0 0)';bl.style.left=(o.v-7)+'px'}}));
    tx.style.clipPath='';
    await fin(gsap.timeline().to(bl,{left:L.left+L.width/2-7,duration:.5,ease:'power3.inOut'}).to(bl,{opacity:0,duration:.15}).to(lg,{opacity:1,duration:.2},'<'));
    bl.remove();cdStart(btn,sec,base)
  }finally{UI=false}}

// ======================================================================
// @@HELPER-RUN   run() wrapper, one-action-at-a-time lock, animRun(), popIn()
//   Every dark pill button goes through run() + animRun().
// ======================================================================
async function absorb(root,btn){const p=root.querySelector('.slot');if(!p||!p.textContent)return;
  const S=p.getBoundingClientRect(),B=btn.getBoundingClientRect();
  await fin(gsap.to(p,{y:B.top+B.height/2-(S.top+S.height/2),scale:.15,opacity:0,transformOrigin:'50% 50%',duration:.45,ease:'power3.in'}));
  p.textContent='';p.style.clipPath='';gsap.set(p,{clearProps:'transform,opacity'})}
async function run(btn,root,fn,dim){if(working||UI)return;working=true;if(dim!==false)btn.style.opacity='.6';await absorb(root,btn);
  try{await fn()}catch(e){if(!/popup-closed|cancelled-popup/.test(e.code||'')){const t=errText(e);if(e.shown){}else if(btn.matches('.btn'))await failAnim(btn,root,t);else say(root,t)}}
  finally{working=false;btn.style.opacity=''}}
// one action at a time: while any animation runs, other buttons ignore clicks; leaving a page clears its message
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.btn,.gbtn,.forgot,.signup button,#back');if(!b)return;
  if(b.dataset.skip){delete b.dataset.skip;return}
  if(UI||working||busy){e.stopImmediatePropagation();e.preventDefault();return}
  if(b.matches('#login .signup button,#back,.forgot,#rs_back,#rs_x,#v_x')){
    const clr=()=>document.querySelectorAll('.slot').forEach(p=>{p.textContent='';p.style.clipPath=''});
    const root=b.closest('.lg'),sl=root&&root.querySelector('.slot');
    if(sl&&sl.textContent){e.stopImmediatePropagation();e.preventDefault();UI=true;
      absorb(root,sl.nextElementSibling||b).then(()=>{UI=false;clr();b.dataset.skip=1;b.click()});return}
    clr()}},true);
const topPg=()=>[...document.querySelectorAll('#home,#verify,#rs1,#rs2,#rs3,#rs4')].filter(p=>p.style.display==='flex').pop()||document.body;
async function animRun(btn,job,show,after){const g=gAnim(btn,true);try{const w=job();w.catch(()=>{});await g.eat();const r=await w;await g.done();if(after){await after(r);g.reset();return}await g.expand();(show||(x=>x&&x.uid?showVerify(x):enter(x)))(r);g.fade()}
  catch(e){const root=btn.closest('#sgf')||btn.closest('.lg'),slot=root&&root.querySelector('.slot');
    if(slot&&!/popup-closed|cancelled-popup/.test(e.code||'')){try{await g.fail(errText(e),slot);e.shown=true}catch(x){g.reset()}}else g.reset();
    throw e}}
function popIn(els,delay){els=[...els];els.forEach(x=>{x.style.transition='none'});
  gsap.from(els,{y:24,opacity:0,duration:.6,stagger:.08,delay:delay||0,ease:'power3.out',onComplete:()=>els.forEach(x=>{x.style.transition='';gsap.set(x,{clearProps:'transform'})})})}
function loginIn(){popIn(lgF.children,.1)}

// ======================================================================
// @@ANIM-BUTTON   Button animations: gAnim() = gather > spinner > tick > expand (dark and Google buttons)
//   To restyle button animations, edit gAnim().
// ======================================================================
const fin=t=>new Promise(r=>t.eventCallback('onComplete',r));
function gAnim(btn,dark){
  const lg=btn.querySelector(dark?'i':'svg'),tx=btn.querySelector('span'),R=btn.getBoundingClientRect(),L=lg.getBoundingClientRect(),T=tx.getBoundingClientRect();
  const x0=Math.max(R.right-24-L.right,T.right-L.left-6),cx=R.left+R.width/2-(L.left+L.width/2);
  btn.style.position='relative';btn.style.overflow='hidden';lg.style.position='relative';lg.style.zIndex=2;
  const sp=document.createElement('div');sp.className='gsp';
  sp.innerHTML='<svg viewBox="0 0 30 30" width="30" height="30"><g class="rot"><circle cx="15" cy="15" r="11" pathLength="100" style="fill:rgba(201,222,60,0)" stroke="#1e4d3a" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="28 72"/></g><path class="tick" d="M9.5 15.5l4 4 7-8" fill="none" stroke="#0b0f10" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></svg>';
  btn.append(sp);if(dark)sp.querySelector('circle').setAttribute('stroke','#c9de3c');
  const rot=sp.querySelector('.rot'),ring=sp.querySelector('circle'),tick=sp.querySelector('.tick');
  let spin,gx;
  const clip=()=>{const c=lg.getBoundingClientRect(),m=c.left+c.width/2;tx.style.clipPath='inset(0 0 0 '+Math.min(T.width,Math.max(0,m-T.left))+'px)'};
  const gather=()=>{const bc=R.left+R.width/2,tc=T.left+T.width/2,lc=L.left+L.width/2;
    const t=gsap.timeline().to(tx,{x:bc-tc,scale:0,opacity:0,duration:.55,ease:'power3.in'},0)
      .to(lg,{x:bc-lc,scale:2.6,duration:.55,ease:'power3.inOut'},0).to(lg,{scale:0,opacity:0,duration:.2},'-=.05')
      .fromTo(sp,{opacity:0,scale:.4},{opacity:1,scale:1,duration:.3,ease:'back.out(2)'},'<')
      .add(()=>{spin=gsap.to(rot,{rotation:360,svgOrigin:'15 15',duration:.8,repeat:-1,ease:'none'})},'<');
    return fin(t)};
  return{
    eat(){
      if(dark)return gather();
      const t=gsap.timeline().to(lg,{x:x0,scale:1.25,duration:.85,ease:'power2.inOut',onUpdate:clip})
        .to(lg,{x:cx,scale:1,duration:.45,ease:'power2.inOut'}).to(lg,{scale:0,opacity:0,duration:.2},'-=.1')
        .fromTo(sp,{opacity:0,scale:.4},{opacity:1,scale:1,duration:.3,ease:'back.out(2)'},'<')
        .add(()=>{spin=gsap.to(rot,{rotation:360,svgOrigin:'15 15',duration:.8,repeat:-1,ease:'none'})},'<');
      return fin(t)},
    done(){spin&&spin.kill();
      const t=gsap.timeline().to(ring,{strokeDasharray:'100 0',fill:'#c9de3c',duration:.3,ease:'power2.out'})
        .to(tick,{strokeDashoffset:0,duration:.35,ease:'power2.out'}).to(sp,{scale:1.2,duration:.12,yoyo:true,repeat:1}).to({},{duration:.3});
      return fin(t)},
    expand(){const r=btn.getBoundingClientRect();gx=document.createElement('div');
      Object.assign(gx.style,{position:'fixed',left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',background:dark?'#0b0f10':'#fff',borderRadius:'99px',zIndex:95,boxSizing:'border-box'});
      gx.append(sp);document.body.append(gx);gsap.to(sp,{opacity:0,duration:.3,delay:.2});
      return fin(gsap.to(gx,{left:0,top:0,width:innerWidth,height:innerHeight,borderRadius:0,backgroundColor:'#f4efe9',duration:.85,ease:'power3.inOut'}))},
    fade(){gsap.to(gx,{opacity:0,duration:.45,onComplete:()=>gx.remove()});popIn(topPg()===document.body?[]:topPg().querySelectorAll('.lg>*'))},
    async fail(text,slot){
      spin&&spin.kill();
      const S=slot.getBoundingClientRect(),B=btn.getBoundingClientRect(),bx=B.left+B.width/2,by=B.top+B.height/2;
      const bl=document.createElement('div');
      Object.assign(bl.style,{position:'fixed',left:bx-7+'px',top:by-7+'px',width:'14px',height:'14px',borderRadius:'50%',background:'#c9de3c',zIndex:96,pointerEvents:'none',opacity:0});
      document.body.append(bl);
      await fin(gsap.timeline().to(sp,{scale:0,opacity:0,duration:.2}).to(bl,{opacity:1,duration:.15},'<'));
      slot.textContent=text;slot.style.color='#d6452a';
      const rg=document.createRange();rg.selectNodeContents(slot);const T=rg.getBoundingClientRect(),sy=S.top+S.height/2;
      slot.style.clipPath='inset(0 '+(S.right-T.left)+'px 0 0)';
      await fin(gsap.timeline().to(bl,{left:T.left-7,top:sy-7,duration:.55,ease:'power3.inOut'}));
      const o={v:T.left};
      await fin(gsap.to(o,{v:T.right,duration:Math.min(1.2,.3+text.length*.022),ease:'none',onUpdate:()=>{slot.style.clipPath='inset(0 '+(S.right-o.v)+'px 0 0)';bl.style.left=(o.v-7)+'px'}}));
      slot.style.clipPath='';
      await fin(gsap.timeline().to(bl,{left:bx-7,top:by-7,duration:.6,ease:'power3.inOut'}).to(bl,{scale:0,duration:.2})
        .to(lg,{x:0,scale:1,opacity:1,duration:.5,ease:'back.out(1.6)'},'<.05').to(tx,{x:0,scale:1,opacity:1,duration:.5,ease:'back.out(1.4)'},'<'));
      bl.remove();sp.remove();btn.style.overflow=btn.style.position='';gsap.set(lg,{x:0,scale:1,opacity:1})},
    reset(){spin&&spin.kill();gsap.killTweensOf([lg,sp,tick,ring]);sp.remove();gx&&gx.remove();gsap.set(lg,{x:0,scale:1,opacity:1});gsap.set(tx,{x:0,scale:1,opacity:1});tx.style.clipPath='';btn.style.overflow=btn.style.position=''}}}

// ======================================================================
// @@ANIM-LINK   Text-link animation: underline > ball > burst / spinner > tick (lineAnim)
//   Used by Forgot password, Resend, Use another email, Back.
// ======================================================================
// Text-link animation: underline takes the text and becomes a ball. mode resend: spinner > tick > back to a line. mode burst: box to the middle, bursts, then cover() swaps the page
async function lineAnim(...a){UI=true;try{return await lineAnim0(...a)}finally{UI=false}}
async function lineAnim0(btn,job,cover){
  job.catch(()=>{});
  const r=btn.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,W=innerWidth,H=innerHeight;
  const ln=document.createElement('div');
  Object.assign(ln.style,{position:'fixed',left:r.left+'px',top:r.bottom-2+'px',width:r.width+'px',height:'2px',background:'#c9de3c',borderRadius:'1px',zIndex:95,pointerEvents:'none'});
  document.body.append(ln);btn.style.borderBottomColor='transparent';
  const sp=document.createElement('div');sp.className='gsp';sp.style.cssText='position:fixed;left:'+cx+'px;top:'+cy+'px;z-index:96';
  sp.innerHTML='<svg viewBox="0 0 30 30" width="30" height="30"><g class="rot"><circle cx="15" cy="15" r="11" pathLength="100" style="fill:rgba(201,222,60,0)" stroke="#1e4d3a" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="28 72"/></g><path class="tick" d="M9.5 15.5l4 4 7-8" fill="none" stroke="#0b0f10" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></svg>';
  document.body.append(sp);
  const rot=sp.querySelector('.rot'),ring=sp.querySelector('circle'),tick=sp.querySelector('.tick');let spin;
  const clean=()=>{spin&&spin.kill();gsap.killTweensOf([btn,ln,sp,ring,tick]);ln.remove();sp.remove();gsap.set(btn,{x:0,scale:1,opacity:1});btn.style.borderBottomColor=''};
  try{
    if(cover){
      await fin(gsap.timeline().to(btn,{scale:0,opacity:0,duration:.4,ease:'power3.in'},0)
        .to(ln,{left:cx-11,top:cy-11,width:22,height:22,borderRadius:6,duration:.45,ease:'power3.inOut'},0)
        .to(ln,{left:W/2-11,top:H/2-11,rotation:180,duration:.6,ease:'power2.inOut'}));
      await job;const R=Math.hypot(W,H);
      await fin(gsap.timeline().to(ln,{left:W/2-R,top:H/2-R,width:2*R,height:2*R,borderRadius:'50%',rotation:0,backgroundColor:'#f4efe9',duration:.8,ease:'power3.in'}));
      await cover();
      await fin(gsap.timeline().to(ln,{opacity:0,duration:.5}));
      clean();return}
    await fin(gsap.timeline().to(btn,{scale:0,opacity:0,duration:.4,ease:'power3.in'},0)
      .to(ln,{left:cx-9,top:cy-9,width:18,height:18,borderRadius:'50%',duration:.45,ease:'power3.inOut'},0)
      .to(ln,{scale:0,opacity:0,duration:.2},'-=.05')
      .fromTo(sp,{opacity:0,scale:.4},{opacity:1,scale:1,duration:.3,ease:'back.out(2)'},'<')
      .add(()=>{spin=gsap.to(rot,{rotation:360,svgOrigin:'15 15',duration:.8,repeat:-1,ease:'none'})},'<'));
    await job;spin&&spin.kill();
    await fin(gsap.timeline().to(ring,{strokeDasharray:'100 0',fill:'#c9de3c',duration:.3,ease:'power2.out'})
      .to(tick,{strokeDashoffset:0,duration:.35,ease:'power2.out'}).to({},{duration:.4}).to(sp,{scale:0,opacity:0,duration:.25})
      .set(ln,{scale:1,opacity:1,left:cx-9,top:cy-9,width:18,height:18,borderRadius:'50%'})
      .to(ln,{left:r.left,top:r.bottom-2,width:r.width,height:2,borderRadius:1,duration:.5,ease:'power3.inOut'})
      .to(btn,{scale:1,opacity:1,duration:.4,ease:'back.out(1.6)'},'<.1'));
    clean()
  }catch(e){clean();throw e}}


// ======================================================================
// @@DATA   Profile data: getProfile, saveProfile, enter(), makeProfile, autoProfile
//   Firestore read/write for players.
// ======================================================================
const getProfile=async u=>{const s=await getDoc(doc(db,'users',u.uid));return s.exists()?s.data():null};
const saveProfile=(u,d)=>runTransaction(db,async tx=>{const r=doc(db,'usernames',d.username);if((await tx.get(r)).exists())throw{code:'app/username-taken'};tx.set(r,{uid:u.uid});tx.set(doc(db,'users',u.uid),{...d,createdAt:serverTimestamp()})});
const enter=(p,np)=>{const u=p.username||'player';q('#hm_user').textContent=u;q('#hm_av').textContent=u[0].toUpperCase();
  try{pfReset();fillPf(p)}catch(e){console.error(e)}   // a card problem must never block login/home
  
  q('#hm_bal').textContent='BDT '+Number(p.balance||0).toLocaleString('en-US',{minimumFractionDigits:2});
  document.querySelectorAll('#verify,#rs1,#rs2,#rs3,#rs4').forEach(x=>x.style.display='none');home.style.display='flex';
  const nb=q('#navball');nb.style.transition='none';showTab(0,true);nb.offsetWidth;nb.style.transition='';
  if(!np)homeIn()};
// home entrance: cards pop up, nav bar rises
function homeIn(){popIn(document.querySelectorAll('#hm0 .hm-sc>*'),.15);gsap.from('#nav',{y:70,opacity:0,duration:.8,delay:.25,ease:'power3.out',clearProps:'transform,opacity'})}
// Already logged in: the intro calls show() while the black strips cover the screen, reveal() when they leave
const settle=(st,p)=>{AUTO.state=st;AUTO.p=p||null;if(AUTO.cb)AUTO.cb()};
Object.assign(AUTO,{show(){q('#login').style.visibility='hidden';home.style.zIndex=35;enter(AUTO.p,true)},reveal(){homeIn();setTimeout(()=>{home.style.zIndex=''},1600)}});
const sgOn=()=>getComputedStyle(q('#signup')).visibility==='visible';
function resetSignup(){pending=null;pwF.forEach(f=>f.style.display='');q('#su_email').readOnly=false;q('#signup .sub').textContent='Create new account';sgF.querySelectorAll('input').forEach(i=>i.value='')}
const introDone=()=>new Promise(r=>{const w=()=>typeof tl!=='undefined'&&tl&&tl.progress()>=1?r():setTimeout(w,300);w()});

async function makeProfile(u){
  let d=null;try{d=JSON.parse(localStorage.getItem(PK)||'null')}catch(e){}
  if(d&&d.email===u.email.toLowerCase()){d={name:d.name,username:d.username,email:u.email,phone:d.phone||'',provider:'password'};
    try{await saveProfile(u,d);try{localStorage.removeItem(PK)}catch(e){}return d}catch(e){if(e.code!=='app/username-taken')throw e}}
  return autoProfile(u)}
// Google login: no extra details needed. Profile is auto-created on first use, then logo > spinner > tick > expand animation
async function autoProfile(u){
  const base=(u.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_.]/g,'')||'player').slice(0,14).padEnd(3,'0');
  for(let i=0;i<8;i++){
    const d={name:u.displayName||base,username:i?base+Math.floor(1000+Math.random()*9000):base,email:u.email,phone:'',provider:u.providerData.some(x=>x.providerId==='google.com')?'google':'password'};
    try{await saveProfile(u,d);return d}catch(e){if(e.code!=='app/username-taken')throw e}}
  throw{code:'app/username-taken'}}

// ======================================================================
// @@PAGE-LOGIN   Login page: email + password button
//   HTML: <!-- @@LOGIN -->  CSS: /* @@LOGIN */
// ======================================================================
// Email + password login (text gathers into a ball > spinner > tick > box expands to home or the verify page)
q('#login .btn').onclick=e=>{const b=e.currentTarget;return run(b,lgF,async()=>{
  const em=lgF.username.value.trim(),pw=lgF.password.value;
  if(!em)throw{code:'app/email-empty'};
  if(!MAIL.test(em))throw{code:'auth/invalid-email'};
  await animRun(b,async()=>{
    const m=await fetchSignInMethodsForEmail(auth,em).catch(()=>[]);
    if(m.includes('google.com')&&!m.includes('password'))throw{code:'app/use-google'};
    if(!pw)throw{code:'app/pw-empty'};
    const {user}=await signInWithEmailAndPassword(auth,em,pw);
    if(!user.emailVerified)return user;
    return await getProfile(user)||await makeProfile(user)})},false)};


// ======================================================================
// @@PAGE-GOOGLE   Continue with Google (login + signup pages)
// ======================================================================
async function finishGoogle(btn,user){const g=gAnim(btn);try{await g.eat();const p=await getProfile(user)||await autoProfile(user);await g.done();await g.expand();enter(p);g.fade()}catch(e){g.reset();throw e}}
const google=btn=>run(btn,sgOn()?sgF:lgF,async()=>{
  const gp=new GoogleAuthProvider();gp.setCustomParameters({prompt:'select_account'});
  try{sessionStorage.setItem('ut_g','1')}catch(x){}
  let user;try{({user}=await signInWithPopup(auth,gp))}finally{try{sessionStorage.removeItem('ut_g')}catch(x){}}
  await finishGoogle(btn,user)},false);
document.querySelectorAll('.gbtn').forEach(b=>b.onclick=()=>google(b));


// ======================================================================
// @@PAGE-CREATE   Create account page: field-by-field checks, then verification email
//   HTML: <!-- @@SIGNUP -->
// ======================================================================
// Create account: makes the login, emails a verification link, and shows the verify page. Profile is saved only after verification.
q('#sgf .btn').onclick=e=>{const b=e.currentTarget;if(!cdReady(b)){shake(b.querySelector('span'));return}return run(b,sgF,async()=>{
  const name=v('name'),un=v('username').toLowerCase(),em=v('email'),ph=v('phone'),p1=q('#su_pw1').value,p2=q('#su_pw2').value;
  await animRun(b,async()=>{
    if(!name)throw{code:'app/name-empty'};
    if(!NAME.test(name))throw{code:'app/name'};
    if(!un)throw{code:'app/username-empty'};
    if(!/^[a-z0-9_.]{3,20}$/.test(un))throw{code:'app/username'};
    if((await getDoc(doc(db,'usernames',un))).exists())throw{code:'app/username-taken'};
    if(!em)throw{code:'app/email-empty'};
    if(!MAIL.test(em))throw{code:'auth/invalid-email'};
    if((await fetchSignInMethodsForEmail(auth,em).catch(()=>[])).length)throw{code:'auth/email-already-in-use'};
    if(ph&&!/^\+?[0-9\s-]{7,15}$/.test(ph))throw{code:'app/phone'};
    if(!p1)throw{code:'app/pw-new-empty'};
    if(p1.length<6)throw{code:'auth/weak-password'};
    if(!p2)throw{code:'app/pw2-empty'};
    if(p1!==p2)throw{code:'app/pw-match'};
    const {user}=await createUserWithEmailAndPassword(auth,em,p1);
    mailP=sendEmailVerification(user);mailP.catch(()=>{});
    try{localStorage.setItem(PK,JSON.stringify({name,username:un,email:em.toLowerCase(),phone:ph}))}catch(e){}
    return user})},false)};


// ======================================================================
// @@PAGE-VERIFY   Check your Gmail page (after Create): timers, Confirm, Resend, Use another email
//   HTML: <!-- @@VERIFY -->
// ======================================================================
const ver=q('#verify'),vF=q('#verify .lg'),PK='ut_pending';let mailP=null;
const COOL=80;
const mkTimer=sel=>{let at=0,id=null;const el=()=>q(sel);
  return{start(sec){clearInterval(id);at=Date.now()+sec*1000;const t=()=>{const n=Math.ceil((at-Date.now())/1000);if(n>0)el().textContent=n+'s';else{el().textContent='';clearInterval(id)}};t();id=setInterval(t,250)},
    ready:()=>Date.now()>=at,block(){clearInterval(id);at=Infinity;el().textContent=''},reset(){clearInterval(id);at=0;el().textContent=''}}};
const T1=mkTimer('#v_t'),T2=mkTimer('#rs_t');
const showVerify=u=>{
  q('#v_mail').textContent=u.email;ver.style.display='flex';
  const p=mailP,ok=q('#v_ok'),st=q('#v_st'),READY='Open the link we sent to your inbox (check Spam too), then come back here and tap Confirm.';
  mailP=null;
  if(!p){st.textContent=READY;ok.style.display='';return}
  ok.style.display='none';T1.block();st.textContent='Sending the link to your Gmail...';
  p.then(()=>{st.textContent=READY;T1.start(COOL)},()=>{st.textContent='Could not send the link automatically. Tap Resend link.';T1.reset()})
   .then(()=>{ok.style.display='';gsap.killTweensOf(ok);gsap.fromTo(ok,{y:16,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'})})};
const shake=b=>gsap.timeline().to(b,{x:-8,duration:.05}).to(b,{x:8,duration:.07}).to(b,{x:-6,duration:.07}).to(b,{x:6,duration:.07}).to(b,{x:0,duration:.05});
// Verify page: Confirm, Resend, Use another email
q('#v_ok').onclick=e=>{const b=e.currentTarget;return run(b,vF,async()=>{
  const u=auth.currentUser;if(!u)throw{code:'app/no-profile'};
  await u.reload();if(!u.emailVerified)throw{code:'app/not-verified'};
  await animRun(b,async()=>await getProfile(u)||await makeProfile(u),enter)},false)};
q('#v_re').onclick=e=>{const b=e.currentTarget;if(b.dataset.busy)return;
  if(!T1.ready()){shake(b);return}
  b.dataset.busy=1;
  lineAnim(b,sendEmailVerification(auth.currentUser)).then(()=>{say(vF,'Link sent again. Check Gmail and Spam',1);T1.start(COOL)},err=>{say(vF,E[err.code]||'Could not send the link. Try again later');if(err.code==='auth/too-many-requests')T1.start(COOL)}).finally(()=>{delete b.dataset.busy})};
q('#v_x').onclick=e=>{const b=e.currentTarget;if(b.dataset.busy)return;const u=auth.currentUser;
  const job=(async()=>{try{if(u&&!u.emailVerified)await deleteUser(u)}catch(err){}await signOut(auth).catch(()=>{});try{localStorage.removeItem(PK)}catch(err){}})();
  if(!sgOn()){job.then(()=>location.reload());return}
  b.dataset.busy=1;T1.reset();
  lineAnim(b,job,()=>{ver.style.display='none';const m=q('#su_email');m.value='';m.readOnly=false;say(sgF,'')}).then(()=>btnWrite(q('#sgf .btn'),'Create',COOL)).finally(()=>{delete b.dataset.busy})};


// ======================================================================
// @@PAGE-RESET   Forgot password pages: email page, Check your Gmail page
//   HTML: <!-- @@RESET -->
// ======================================================================
// ===== Forgot password: forgot link > email page > check Gmail > verify > new password > back to login =====
const rs1=q('#rs1'),rs2=q('#rs2'),rs3=q('#rs3'),rs4=q('#rs4'),rsF4=q('#rs4 .lg'),rsF1=q('#rs1 .lg'),rsF2=q('#rs2 .lg'),rsF3=q('#rs3 .lg'),RK='ut_reset';
let rsMail='',rsCode=null;
const noForgot=()=>{q('.forgot').style.display='none';q('#login .signup').style.display='none'};
const ACS=()=>({url:location.origin+location.pathname+'?reset=done'});
const rsSaved=()=>{try{return JSON.parse(localStorage.getItem(RK)||'null')}catch(e){return null}};
const rsClear=()=>{try{localStorage.removeItem(RK)}catch(e){}};
function resetRs(){[rs1,rs2,rs3,rs4].forEach(p=>p.style.display='none');['#rs_send','#rs_ok','#np_ok'].forEach(i=>restoreBtn(q(i)));['#rs_email','#np1','#np2'].forEach(i=>q(i).value='');T2.reset();rsCode=null;rsMail='';rsClear()}
const showRs2=()=>{q('#rs_mail').textContent=rsMail;rs2.style.display='flex';q('#rs_ok').style.display='';
  q('#rs_st').textContent='Open the link in your Gmail (check Spam too) and set your new password on the page that opens. Then come back here and tap the button below.'};
const showRs3=d=>{rsCode=d.code;rsMail=d.email;q('#rs3_mail').textContent=d.email;rs3.style.display='flex'};
q('.forgot').onclick=e=>{const b=e.currentTarget;if(b.dataset.busy)return;b.dataset.busy=1;
  q('#rs_email').value=lgF.username.value.trim();
  lineAnim(b,Promise.resolve(),()=>{rs1.style.display='flex';popIn(document.querySelectorAll('#rs1 .lg>*'),.1)}).finally(()=>{delete b.dataset.busy})};
q('#rs_back').onclick=e=>{const b=e.currentTarget;if(b.dataset.busy)return;b.dataset.busy=1;lineAnim(b,Promise.resolve(),()=>{resetRs();loginIn()}).finally(()=>{delete b.dataset.busy})};
q('#rs_send').onclick=e=>{const b=e.currentTarget;if(!cdReady(b)){shake(b.querySelector('span'));return}return run(b,rsF1,async()=>{
  const em=q('#rs_email').value.trim().toLowerCase();
  if(!em)throw{code:'app/email-empty'};
  if(!MAIL.test(em))throw{code:'auth/invalid-email'};
  await animRun(b,async()=>{await sendPasswordResetEmail(auth,em,ACS());try{localStorage.setItem('ut_rmail',em)}catch(x){}rsMail=em;T2.start(COOL);return 1},showRs2)},false)};
q('#rs_ok').onclick=e=>{const b=e.currentTarget;return run(b,rsF2,async()=>{
  const d=rsSaved(),em=rsMail,linked=d&&d.email===em,no=linked&&d.choice==='no';
  if(linked&&d.choice==='yes'){await animRun(b,async()=>{await verifyPasswordResetCode(auth,d.code);return d},showRs3);return}
  const wait=async()=>{await new Promise(r=>setTimeout(r,700));return 1};
  const tail=()=>{resetRs();lgF.username.value=em;lgF.password.value='';if(!no)noForgot();say(lgF,no?'No changes were made to your password.':'Log in with your new password.',1);loginIn()};
  await animRun(b,wait,tail)},false)};
q('#rs_re').onclick=e=>{const b=e.currentTarget;if(b.dataset.busy)return;if(!T2.ready()){shake(b);return}
  b.dataset.busy=1;
  lineAnim(b,sendPasswordResetEmail(auth,rsMail,ACS())).then(()=>{say(rsF2,'Link sent again. Check Gmail and Spam',1);T2.start(COOL)},err=>{say(rsF2,E[err.code]||'Could not send the link. Try again later');if(err.code==='auth/too-many-requests')T2.start(COOL)}).finally(()=>{delete b.dataset.busy})};
q('#rs_x').onclick=e=>{const b=e.currentTarget;if(b.dataset.busy)return;b.dataset.busy=1;T2.reset();rsClear();
  lineAnim(b,Promise.resolve(),()=>{rs2.style.display='none';q('#rs_email').value=''}).then(()=>btnWrite(q('#rs_send'),'Send verification link',COOL)).finally(()=>{delete b.dataset.busy})};
for(const [fm,id] of [[rsF1,'#rs_send'],[rsF3,'#np_ok']])fm.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.tagName==='INPUT'){e.preventDefault();q(id).click()}});

// ======================================================================
// @@PAGE-HOME   Home page: tabs (Home, Tours, Results, Profile), glass nav bar with sliding ball, toast
//   HTML: <!-- @@HOME -->  CSS: /* @@HOME */  Filled by enter() in @@DATA.
// ======================================================================
// Tab switch: pages sit side by side like a carousel. Right tab = old page leaves LEFT, new page arrives from RIGHT; left tab = reverse.
// Every tap goes into a queue and the pages change ONE BY ONE (faster when many are waiting), so animations never overlap.
// If 10 taps are waiting (spam): finish the next page, stop, go Home, then the red "stop" animation plays and input is locked.
let cur=0;const SLIDE={d:.38,e:'power3.out'},LIM=10;
const PG=[...document.querySelectorAll('.hm-pg')],X=PG.map(()=>0),TW=PG.map(()=>null),DONE=PG.map(()=>null);
const put=(i,x)=>{X[i]=x;PG[i].style.transform='translate3d('+x+'%,0,0)'};
const hideP=i=>{if(TW[i])TW[i].kill();TW[i]=null;if(DONE[i]){DONE[i]();DONE[i]=null}PG[i].classList.remove('on');X[i]=0;PG[i].style.transform=''};
function move(i,to,dur){return new Promise(res=>{if(TW[i])TW[i].kill();if(DONE[i])DONE[i]();DONE[i]=res;const o={x:X[i]};
  TW[i]=gsap.to(o,{x:to,duration:dur,ease:SLIDE.e,onUpdate:()=>put(i,o.x),
    onComplete:()=>{TW[i]=null;DONE[i]=null;if(i===cur){X[i]=0;PG[i].style.transform=''}else hideP(i);res()}})})}
function ballTo(n,d){const items=[...document.querySelectorAll('#nav .nv')],nb=q('#navball'),bt=items[n];
  items.forEach((b,i)=>b.classList.toggle('on',i===n));
  nb.style.transitionDuration=d?d+'s':'';nb.style.left=(bt.offsetLeft+2)+'px';nb.style.width=(bt.offsetWidth-4)+'px'}
function showTab(n,instant,d){
  d=d||SLIDE.d;if(instant)ballTo(n,0);
  if(instant){PG.forEach((p,i)=>{hideP(i);if(i===n)p.classList.add('on')});cur=n;Q.length=0;return Promise.resolve()}
  const old=cur,dir=n>old?1:n<old?-1:0;cur=n;
  let parked=false;
  if(!PG[n].classList.contains('on')){PG[n].classList.add('on');put(n,(dir||1)*100);parked=true}
  const jobs=[[n,0]];
  PG.forEach((p,i)=>{if(i===n||!p.classList.contains('on'))return;
    const side=i===old?-dir:(X[i]<0?-1:1);
    if(parked&&i!==old&&side===dir){hideP(i);return}
    jobs.push([i,side*100])});
  const far=Math.max(...jobs.map(([i,t])=>Math.abs(t-X[i]))),dur=d*(.4+.6*Math.min(1,far/100));
  return Promise.all(jobs.map(([i,t])=>move(i,t,dur)))}

// ---- tap queue
const Q=[];let running=false,locked=false;
const lastTarget=()=>Q.length?Q[Q.length-1]:cur;
async function pump(){if(running)return;running=true;q('#home').classList.add('busy');
  while(Q.length){const n=Q.shift(),pend=Q.length;await showTab(n,false,pend>2?.2:pend>0?.28:SLIDE.d)}
  running=false;if(locked)await penalty();
  if(!running&&!Q.length)q('#home').classList.remove('busy')}
function go(i){if(locked||i===lastTarget())return;
  ballTo(i,.4);   // green ball goes to the tapped icon right away (it can change its mind mid-way)
  Q.push(i);
  if(Q.length>=LIM){locked=true;Q.splice(1);ballTo(Q[0],.4)}   // too many: keep only the very next page, then stop
  pump()}
document.querySelectorAll('#nav .nv').forEach((b,i)=>b.onclick=()=>{if(locked)return;try{navigator.vibrate&&navigator.vibrate(8)}catch(x){}go(i)});

// ---- "stop spamming" animation
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const tw=(el,v)=>new Promise(r=>gsap.to(el,{...v,onComplete:r}));
async function penalty(){
  const nav=q('#nav'),nb=q('#navball'),H=q('#home'),S=q('#jamsc');let card=null;
  const ease='power3.inOut';
  try{
    if(cur!==0){ballTo(0,.45);await showTab(0,false,.4)}
    await wait(150);
    // 1) green ball -> middle of the nav bar, turns red
    document.querySelectorAll('#nav .nv').forEach(b=>b.classList.remove('on'));
    nb.style.transitionDuration='.6s';nb.style.left=((nav.clientWidth-nb.offsetWidth)/2)+'px';nb.classList.add('red');
    await wait(750);
    // 2) the nav bar (with the red ball in it) is swapped for an identical card that carries it to the middle of the screen
    const hr=H.getBoundingClientRect(),nr=nav.getBoundingClientRect(),br=nb.getBoundingClientRect();
    const rel={left:br.left-nr.left-1,top:br.top-nr.top-1,width:br.width,height:br.height};
    const w=Math.min(320,hr.width-40),h=224,D=62,cx=hr.width/2,cy=hr.height/2-10;
    card=document.createElement('div');card.id='jam';
    card.innerHTML='<div id="jamball"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg></div><div id="jamin"></div><p id="jamtx"><b>Hey, what\'s going on?</b><span>Why all the rapid taps? Did something go wrong? Tell me and I\'ll help you out.</span></p>';
    const ball=card.querySelector('#jamball'),I=card.querySelector('svg'),T=card.querySelector('#jamtx'),IN=card.querySelector('#jamin');
    nav.querySelectorAll('.nv').forEach(b=>IN.appendChild(b.cloneNode(true)));
    H.appendChild(card);
    gsap.set(card,{left:nr.left-hr.left,top:nr.top-hr.top,width:nr.width,height:nr.height});
    gsap.set(ball,rel);
    T.style.top=(26+D+14)+'px';T.style.width=(w-42)+'px';
    nav.style.visibility='hidden';
    S.style.display='block';gsap.to(S,{opacity:1,duration:.6});
    // 3) in ONE smooth motion: the bar grows into the card while flying to the middle, the red ball becomes the "no" sign
    await Promise.all([
      tw(IN,{opacity:0,duration:.35,ease:'power1.out'}),
      tw(card,{left:cx-w/2,top:cy-h/2,width:w,height:h,borderRadius:30,duration:1,ease}),
      tw(ball,{left:(w-2-D)/2,top:26,width:D,height:D,borderRadius:D/2,duration:1,ease})]);
    gsap.fromTo(I,{opacity:0,scale:.5},{opacity:1,scale:1,duration:.5,ease:'back.out(2)'});
    gsap.fromTo(T,{opacity:0,y:10},{opacity:1,y:0,duration:.6,delay:.15});
    await wait(3200);
    // 4) content fades, then card shrinks straight back into the nav bar (sign -> red ball) in one motion
    gsap.to([T,I],{opacity:0,duration:.3});gsap.to(S,{opacity:0,duration:.7,delay:.2});
    await wait(250);
    await Promise.all([
      tw(IN,{opacity:1,duration:.4,delay:.6,ease:'power1.in'}),
      tw(card,{left:nr.left-hr.left,top:nr.top-hr.top,width:nr.width,height:nr.height,borderRadius:32,duration:1,ease}),
      tw(ball,{...rel,borderRadius:26,duration:1,ease})]);
    nav.style.visibility='';card.remove();card=null;S.style.display='none';
    // 5) back to Home, ball green again
    nb.classList.remove('red');ballTo(0,.6);
    await wait(700);
  }finally{
    if(card)card.remove();nav.style.visibility='';S.style.display='none';nb.classList.remove('red');ballTo(cur,.4);
    Q.length=0;locked=false}}

// drag left/right on the home area: next page follows the finger, then settles (or snaps back).
// Swiping while pages are still changing just adds to the queue.
{const H=q('#home');let sx=0,sy=0,st=0,lock='',side=0,W=1;
 H.addEventListener('touchstart',e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;st=Date.now();side=0;W=H.clientWidth||1;
  lock=(locked||e.target.closest('#nav'))?'no':(running||Q.length)?'anim':''},{passive:true});
 H.addEventListener('touchmove',e=>{if(lock==='no'||lock==='anim')return;const t=e.touches[0],dx=t.clientX-sx,dy=t.clientY-sy;
  if(!lock){if(Math.abs(dx)<8&&Math.abs(dy)<8)return;lock=Math.abs(dx)>Math.abs(dy)*1.2?'x':'y'}
  if(lock!=='x')return;
  const s2=dx<0?1:-1,nx=cur+s2,ok=nx>=0&&nx<PG.length,pc=dx/W*100,cl=Math.max(-100,Math.min(100,pc));
  if(s2!==side){if(side&&PG[cur+side])hideP(cur+side);side=s2;if(ok){PG[nx].classList.add('on');put(nx,s2*100)}}
  if(!ok){put(cur,pc/4);return}
  put(cur,cl);put(nx,s2*100+cl)},{passive:true});
 H.addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
  if(lock==='x'){const nx=cur+(dx<0?1:-1),v=Math.abs(dx)/Math.max(1,Date.now()-st);
   if(nx>=0&&nx<PG.length&&(Math.abs(dx)>W*.28||(v>.5&&Math.abs(dx)>30)))go(nx);else showTab(cur)}
  else if(lock==='anim'&&Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5){const nx=lastTarget()+(dx<0?1:-1);if(nx>=0&&nx<PG.length)go(nx)}},{passive:true});
 H.addEventListener('touchcancel',()=>{if(lock==='x')showTab(cur)},{passive:true})}
const toast=t=>{const e=q('#toast');e.textContent=t;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),2000)};
document.querySelectorAll('[data-toast]').forEach(b=>b.onclick=()=>toast(b.dataset.toast));

// ======================================================================
// @@PAGE-PROFILE   Profile tab: info card, pen icon > edit mode > Update. A changed (already filled) detail locks for 24h.
//   HTML: <!-- @@PROFILE -->  CSS: /* @@PROFILE */  Filled by fillPf() (called from enter() in @@DATA).
//   Email is shown but cannot be edited. Empty details can be added any time (no lock); lock starts only when a filled detail is changed.
// ======================================================================
const DAY=864e5,pf=q('#pf'),pfAct=q('#pf_act'),PF=[['name','Aa','Full Name'],['username','@','Username'],['phone','#','Phone Number']];
Object.assign(E,{'app/pf-same':'Nothing changed yet','app/pf-locked':'This detail was changed recently. Try again later'});
let ME=null;
const lockAt=(p,k)=>{const t=p.locks&&p.locks[k];return t?(t.toMillis?t.toMillis():+t):0};
const LOCK_ON=false;   // 24h lock is OFF for now (testing). Set true to turn it on.
const lockLeft=(p,k)=>LOCK_ON&&p[k]?lockAt(p,k)+DAY-Date.now():0;
q('#pf_rows').innerHTML=PF.map(([k,ic,lb])=>`<label class="pf-row${k==='email'?' ro':''}" data-k="${k}"><i class="ic"><b>${ic}</b></i><span class="tx"><small>${lb}<em class="pf-n"></em></small><b class="pf-v"></b>${k==='email'?'':`<input class="pf-in" type="${k==='phone'?'tel':'text'}" autocapitalize="none" spellcheck="false" placeholder="${k==='phone'?'Not uploaded yet':''}" autocomplete="off">`}</span></label>`).join('');
function fillPf(p){ME=p;const u=p.username||'player';
  q('#hm_user').textContent=u;q('#hm_av').textContent=q('#pf_av').textContent=u[0].toUpperCase();
  pf.querySelectorAll('.pf-row').forEach(r=>r.querySelector('.pf-v').textContent=p[r.dataset.k]||'');
  q('#pf_nm').textContent=p.name||'';q('#pf_em').textContent=p.email||'';q('#pf_un').textContent='@'+u;
  const ph=q('#pf_ph');ph.hidden=!p.phone;ph.classList.toggle('ok',!!p.phoneVerified);ph.querySelector('b').textContent=p.phone||'';ph.querySelector('span').textContent=p.phoneVerified?'Verified number':'Verify your number'}
// tap the @username to copy it
q('#pf_un').onclick=async()=>{const t=q('#pf_un').textContent;try{await navigator.clipboard.writeText(t)}catch(e){const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.append(a);a.select();try{document.execCommand('copy')}catch(x){}a.remove()}toast('Username copied')};
function pfMode(on){pfUpdReset();
  if(on)pf.querySelectorAll('.pf-row').forEach(r=>{const k=r.dataset.k,i=r.querySelector('input'),n=r.querySelector('.pf-n'),L=lockLeft(ME,k),lk=L>0;
    r.classList.toggle('lk',lk);if(i){i.value=ME[k]||'';i.disabled=lk}
    if(k==='email')n.textContent="Can't be changed";
    else if(lk){const m=Math.ceil(L/6e4);n.textContent='Locked · change again in '+(m>=60?Math.floor(m/60)+'h '+m%60+'m':m+'m')}})}
// Save changed details (one transaction: re-checks the 24h lock on the server copy, swaps the username record if it changed)
const updProfile=(u,ch)=>runTransaction(db,async tx=>{
  const ref=doc(db,'users',u.uid),cur=(await tx.get(ref)).data()||{},L={...(cur.locks||{})},loc={...L},nu=ch.username;
  let nr=null;if(nu){nr=doc(db,'usernames',nu);if((await tx.get(nr)).exists())throw{code:'app/username-taken'}}
  for(const k in ch)if(LOCK_ON&&cur[k]){if(lockLeft(cur,k)>0)throw{code:'app/pf-locked'};L[k]=serverTimestamp();loc[k]=Date.now()}
  if(nu){tx.set(nr,{uid:u.uid});if(cur.username)tx.delete(doc(db,'usernames',cur.username))}
  tx.update(ref,{...ch,locks:L});return {...cur,...ch,locks:loc}});
// ---- pen animation: pfToggle(true) opens the card, pfToggle(false) closes it (exact reverse). Pen = #pf_pen, ball = #pf_ed
const pfBall=q('#pf_ed'),pfPen=q('#pf_pen'),pfWrap=q('#pf_wrap'),penI=pfBall.querySelector('.pen'),xI=pfBall.querySelector('.x');
const pfHm=q('#hm3'),pfBP=q('#pf_bp'),pfBA=q('#pf_ba'),pfAR=q('#pf_ar'),pfUT=q('#pf_ut'),pfWT=q('#pf_wt'),pfOK=q('#pf_ok'),pfW=q('#pf_w');
let pfBusy=false,pfNC=0,pfShown='';
// while any profile animation runs only the bottom navigation works: no button/box on this page reacts, keyboard closes
function pfLock(on){pfBusy=on;pfHm.classList.toggle('anim',on);if(on&&document.activeElement&&document.activeElement.blur)document.activeElement.blur()}
// Update button back to normal (pen at its place, "Update" written, no message) - used when the card opens/closes
function pfUpdReset(){pfNC=0;pfShown='';pfWT.textContent='';pfWT.style.cssText='';pfUT.style.clipPath='';
  gsap.set(pfBP,{x:0,y:0,rotation:0,scale:1,autoAlpha:1});gsap.set(pfBA,{autoAlpha:0,scale:0,rotation:0})}
function pfReset(){pf.classList.remove('ed');pf.style.height='';pfLock(false);pfUpdReset();
  gsap.set(pfBall,{scale:1});gsap.set(penI,{autoAlpha:1,scale:1,rotation:0});gsap.set(xI,{autoAlpha:0,scale:0,rotation:0});
  gsap.set(pfPen,{autoAlpha:0,xPercent:-50,yPercent:-50,x:0,y:0,rotation:0,scale:1})}
pfReset();
function pfFly(tl,t,x1,y1,y0){const d=.75,pk=Math.min(y0,y1)-50;   // jump in an arc while spinning
  tl.to(pfPen,{x:x1,duration:d,ease:'power1.inOut'},t).to(pfPen,{y:pk,duration:d*.45,ease:'power2.out'},t)
    .to(pfPen,{y:y1,duration:d*.55,ease:'power2.in'},t+d*.45).to(pfPen,{rotation:'+=720',duration:d,ease:'power1.inOut'},t);return t+d}
function pfToggle(open){
  if(pfBusy||!ME)return;pfLock(true);
  const W=pfWrap.offsetWidth,bx=W-32,by=32;let h0,h1;
  if(open){pfMode(true);h0=pf.offsetHeight;pf.classList.add('ed');pf.style.height='';h1=pf.offsetHeight}
  else{h1=pf.offsetHeight;pf.classList.remove('ed');pf.style.height='';h0=pf.offsetHeight;pf.classList.add('ed')}
  const a=open?h0:h1,b=open?h1:h0,P={h:a};pf.style.height=a+'px';
  const tl=gsap.timeline({onComplete(){pf.style.height='';if(!open){pf.classList.remove('ed');pfUpdReset()}gsap.set(pfPen,{autoAlpha:0});pfHm.classList.remove('noscroll');pfLock(false)}});
  let t=0;
  if(!open){tl.to(xI,{rotation:-180,scale:0,duration:.35,ease:'back.in(1.7)'},0).fromTo(penI,{rotation:180,scale:0,autoAlpha:1},{rotation:0,scale:1,duration:.4,ease:'back.out(1.7)'},.2);t=.7}
  // 1) jelly: the ball stretches up, the pen is pulled out and flies up, then falls under gravity onto the ball, which dents like jelly
  tl.to(pfBall,{scaleX:.8,scaleY:1.35,y:-6,duration:.16,ease:'power2.out'},t).to(penI,{scale:0,autoAlpha:0,duration:.14},t+.02)
    .set(pfPen,{x:bx,y:by,rotation:0,scaleX:.5,scaleY:.2,autoAlpha:1},t+.06)
    .to(pfPen,{scaleX:1,scaleY:1.2,y:by-62,duration:.38,ease:'power2.out'},t+.08)
    .to(pfBall,{scale:.5,y:0,duration:.5,ease:'elastic.out(1,.3)'},t+.18)
    .to(pfPen,{scaleY:1,y:by-14,duration:.3,ease:'power2.in'},t+.46)
    .to(pfBall,{scaleX:.62,scaleY:.34,duration:.08,yoyo:true,repeat:1,ease:'power1.out'},t+.76);
  // 2) jump to the middle of the card's bottom line, pull it down (open) or push it up (close)
  let f=pfFly(tl,t+.76,W/2,a,by-14);   // bounces straight off the jelly into the jump
  tl.to(pfPen,{scaleX:1.25,scaleY:.7,duration:.09,yoyo:true,repeat:1},f)
    .to(P,{h:b,duration:1.05,ease:open?'back.out(1.15)':'power2.inOut',onUpdate(){pf.style.height=P.h+'px';gsap.set(pfPen,{y:P.h})}},f+.1);
  // 3) jump back onto the ball, dive in, ball grows, the icon turns into X (open) / pen (close)
  f=pfFly(tl,f+1.25,bx,by-14,b);
  tl.to(pfBall,{scaleX:.62,scaleY:.34,duration:.08,yoyo:true,repeat:1},f)   // lands on the jelly: dent
    .to(pfPen,{y:by-36,duration:.18,ease:'power2.out'},f+.04).to(pfPen,{y:by-6,scaleX:.8,scaleY:.3,duration:.22,ease:'power2.in'},f+.22)   // small bounce, then sinks into the jelly
    .to(pfBall,{scale:1,duration:.8,ease:'elastic.out(1,.4)'},f+.3).set(pfPen,{autoAlpha:0},f+.46)
    .fromTo(penI,{scale:.5,rotation:0,autoAlpha:0},{scale:1,autoAlpha:1,duration:.2,ease:'back.out(2)'},f+.46);   // the pen is now the icon inside the ball
  if(open)tl.to(penI,{rotation:180,scale:0,duration:.4,ease:'back.in(1.7)'},f+1.1)   // only now it turns into X
    .fromTo(xI,{rotation:-180,scale:0,autoAlpha:1},{rotation:0,scale:1,duration:.5,ease:'back.out(1.8)'},f+1.25)}
q('#pf_ed').onclick=()=>{if(working||UI)return;pfToggle(!pf.classList.contains('ed'))};
pf.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('input')){e.preventDefault();q('#pf_ok').click()}});
// ---- Update button: the pen erases "Update" with its rubber end, spins, writes the reply with its tip, writes "Update" back, goes home.
//      5th empty click: pen becomes an arrow and shoots the X ball, then the card closes.   (English texts: edit PF_MSG to change)
const PF_MSG=['Nothing was changed.','Please change or add any of your details.',"What's the problem? What do you want to do??","I can't understand what you want??","Sorry, I couldn't help you."];
const pfSl=ms=>new Promise(r=>setTimeout(r,ms)),pfTw=(t,v)=>new Promise(r=>gsap.to(t,{...v,onComplete:r}));
const pfVp=(el,fx=.5,fy=.5)=>{const r=el.getBoundingClientRect();return{x:r.left+r.width*fx,y:r.top+r.height*fy}};
const pfRestNow=()=>{const c=pfVp(pfBP);return{x:c.x-gsap.getProperty(pfBP,'x'),y:c.y-gsap.getProperty(pfBP,'y')}};   // pen's layout position now (page may have been scrolled)
const pfPenTo=(c,rot,d=.5,ease='power2.inOut')=>{const r=pfRestNow();return pfTw(pfBP,{x:c.x-r.x,y:c.y-r.y,rotation:rot,duration:d,ease})};
const pfHome=()=>pfTw(pfBP,{x:0,y:0,rotation:0,duration:.35,ease:'power2.inOut'});
const pfToTop=()=>new Promise(r=>{const sc=pfHm.querySelector('.hm-sc'),S={v:sc.scrollTop};if(S.v<2){r();return}gsap.to(S,{v:0,duration:Math.min(1,.35+S.v/1600),ease:'power2.inOut',onUpdate(){sc.scrollTop=S.v},onComplete:r})});
const pfTip=b=>({x:b.left+7.3,y:b.top+b.height/2-1.3}),pfRub=b=>({x:b.right,y:b.top+b.height/2-2});   // pen centre for tip at text start / rubber at text end
function pfSweep(el,mode,d){return new Promise(r=>{const b=el.getBoundingClientRect(),S={p:0},w=mode==='write',rs=pfRestNow();
  gsap.to(S,{p:1,duration:d,ease:'none',onComplete:r,onUpdate(){const p=S.p;el.style.clipPath='inset(0 '+(w?(1-p)*100:p*100)+'% 0 0)';
    const wob=0,x=w?b.left+p*b.width:b.right-p*b.width,c=w?{x:x+7.3,y:b.top+b.height/2-1.3+wob}:{x,y:b.top+b.height/2-2+wob};
    gsap.set(pfBP,{x:c.x-rs.x,y:c.y-rs.y})}})})}
function pfCollect(){const ch={};
  for(const [k] of PF){const i=pf.querySelector('[data-k="'+k+'"] input');if(!i||i.disabled)continue;
    let val=i.value.trim();if(k==='username')val=val.toLowerCase();
    if(val===(ME[k]||''))continue;
    if(k==='name'){if(!val)throw{code:'app/name-empty'};if(!NAME.test(val))throw{code:'app/name'}}
    if(k==='username'){if(!val)throw{code:'app/username-empty'};if(!/^[a-z0-9_.]{3,20}$/.test(val))throw{code:'app/username'}}
    if(k==='phone'&&val&&!/^\+?[0-9\s-]{7,15}$/.test(val))throw{code:'app/phone'};
    ch[k]=val}
  return ch}
function pfBurst(x,y){for(let i=0;i<9;i++){const d=document.createElement('i');d.style.cssText='position:absolute;left:0;top:0;width:6px;height:6px;border-radius:50%;background:#c9de3c;z-index:9;pointer-events:none';pfWrap.appendChild(d);
  const a=i/9*6.283+Math.random()*.5,r=26+Math.random()*16;gsap.fromTo(d,{x,y,scale:1},{x:x+Math.cos(a)*r,y:y+Math.sin(a)*r,scale:0,duration:.5,ease:'power2.out',onComplete:()=>d.remove()})}}
async function pfShoot(){   // pen > arrow aimed at the X ball; a copy flies and bursts on it, the arrow stays in the button
  const a=pfVp(pfBP),t=pfVp(pfBall),ang=Math.atan2(t.y-a.y,t.x-a.x)*180/Math.PI,rad=ang*Math.PI/180;
  gsap.set(pfBA,{autoAlpha:0,scale:0,rotation:ang-180});
  await Promise.all([pfTw(pfBP,{scale:0,rotation:'+=180',autoAlpha:0,duration:.35,ease:'back.in(1.6)'}),pfTw(pfBA,{autoAlpha:1,scale:1,rotation:ang,duration:.5,ease:'back.out(1.6)',delay:.15})]);
  const w=pfWrap.getBoundingClientRect(),s=pfVp(pfBA),x0=s.x-w.left,y0=s.y-w.top;
  gsap.set(pfAR,{x:x0,y:y0,xPercent:-50,yPercent:-50,rotation:ang,scaleX:1,scaleY:1,autoAlpha:1});
  await pfTw(pfAR,{x:x0-Math.cos(rad)*14,y:y0-Math.sin(rad)*14,duration:.25,ease:'power2.out'});   // pull back
  await pfTw(pfAR,{x:t.x-w.left,y:t.y-w.top,duration:.45,ease:'power3.in'});            // shoot
  gsap.set(pfAR,{autoAlpha:0});pfBurst(t.x-w.left,t.y-w.top);
  await pfTw(pfBall,{scale:.72,duration:.1,ease:'power2.out'});gsap.to(pfBall,{scale:1,duration:.7,ease:'elastic.out(1,.35)'});await pfSl(400)}
pfOK.onclick=async()=>{
  if(pfBusy||!ME)return;pfLock(true);
  try{
    gsap.set(pfBP,{x:0,y:0,rotation:0,scale:1,autoAlpha:1});
    let ch={},err='';try{ch=pfCollect()}catch(e){err=errText(e)}
    const same=!err&&!Object.keys(ch).length;pfNC=same?pfNC+1:0;
    const save=(!err&&!same)?updProfile(auth.currentUser,ch):null;if(save)save.catch(()=>{});
    // 1) rubber end erases "Update"
    await pfPenTo(pfRub(pfUT.getBoundingClientRect()),135,.4);await pfSweep(pfUT,'erase',.38);
    // 2) pen goes to the middle of the button and spins (while saving, if there is something to save)
    await pfPenTo(pfVp(pfOK),0,.4);
    const sp=[gsap.timeline().to(pfBP,{rotation:'+=360',duration:.5,ease:'power2.in'},0)
      .to(pfBP,{rotation:'+=360',duration:.2,repeat:-1,ease:'none'},.5)];
    let res=null;const min=pfSl(1400);
    if(save){try{res=await save}catch(e){err=errText(e)}}
    await min;sp.forEach(x=>x.kill());gsap.set(pfBP,{autoAlpha:1});
    await pfTw(pfBP,{rotation:Math.ceil(gsap.getProperty(pfBP,'rotation')/360)*360,duration:.35,ease:'power2.out'});gsap.set(pfBP,{rotation:0});
    if(!res){   // 3) pen writes the reply between the boxes and the button (old reply is rubbed out first)
      const text=err||PF_MSG[Math.min(pfNC,5)-1];
      if(pfShown){await pfPenTo(pfRub(pfWT.getBoundingClientRect()),135,.45);await pfSweep(pfWT,'erase',.32)}
      pfWT.textContent=text;pfWT.style.clipPath='inset(0 100% 0 0)';pfWT.style.fontSize='';
      const av=pfW.clientWidth-8,tw0=pfWT.offsetWidth;if(tw0>av)pfWT.style.fontSize=Math.max(8,11*av/tw0).toFixed(1)+'px';
      await pfPenTo(pfTip(pfWT.getBoundingClientRect()),0,.4);await pfSweep(pfWT,'write',Math.max(.55,text.length*.03));pfShown=text}
    // 4) pen writes "Update" back and goes home
    await pfPenTo(pfTip(pfUT.getBoundingClientRect()),0,.45);await pfSweep(pfUT,'write',.4);await pfHome();
    if(res){fillPf(res);toast('Profile updated');pfLock(false);pfToggle(false);return}
    if(!err&&same&&pfNC>=5){pfHm.classList.add('noscroll');await pfToTop();await pfShoot();pfLock(false);pfToggle(false);return}
  }catch(e){console.error(e);pfUpdReset();pfHm.classList.remove('noscroll')}
  pfLock(false)};


// ======================================================================
// @@STARTUP   On page load: coming back from Firebase pages, Google reload, logout, auth state
// ======================================================================
// Came back from Firebase's reset page via the Continue button
const skipIntro=()=>{const w=()=>{if(typeof tl!=='undefined'&&tl)tl.progress(1);else setTimeout(w,50)};w()};
if(new URLSearchParams(location.search).get('reset')==='done'){history.replaceState(null,'',location.pathname);skipIntro();
  introDone().then(()=>{let em='';try{em=localStorage.getItem('ut_rmail')||''}catch(x){}if(em)lgF.username.value=em;noForgot();say(lgF,'Password changed. Please log in.',1);loginIn()})}
// Phone browser reloaded the page while Google's account page was open: stay on login (no intro), and finish the login if it went through
if(GFLAG&&!VERIFIED){skipIntro();
  (async()=>{await auth.authStateReady();await introDone();const u=auth.currentUser;
    if(!u){say(lgF,'Google sign-in not completed. Try again.');return}
    if(!u.emailVerified){showVerify(u);return}
    working=true;try{await finishGoogle(q('#login .gbtn'),u)}catch(e){say(lgF,E[e.code]||'Login could not finish ('+(e.code||e.message)+'). Tap Continue with Google again.')}finally{working=false}})()}
// Back from Google registration = cancel; Enter key; logout; stay logged in
q('#back').addEventListener('click',()=>{if(pending){signOut(auth);resetSignup()}});
for(const f of [lgF,sgF])f.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.tagName==='INPUT'){e.preventDefault();f.querySelector('.btn').click()}});
q('#h_out').onclick=async()=>{await signOut(auth);location.reload()};
onAuthStateChanged(auth,async u=>{
  if(!u){if(AUTO.state==='wait')settle('login');return}
  if(working||pending||VERIFIED||GFLAG)return;
  try{const p=u.emailVerified?await getProfile(u):null;
    // already logged in: tell the intro to open home directly (no login page flash)
    if(AUTO.state==='wait'){if(p){settle('home',p);return}settle('login')}
    await introDone();if(working)return;
    if(p)enter(p);else if(!u.emailVerified)showVerify(u);else enter(await makeProfile(u))}
  catch(e){if(AUTO.state==='wait')settle('login');if(!/unavailable|network/.test(e.code||''))await signOut(auth)}});


// ======================================================================
// @@DORMANT   INACTIVE until a domain is bought and Firebase "Customize action URL" is saved
//   Yes/No page, in-app new password page, link-verified flow, ?mode=resetPassword handler.
// ======================================================================
const VACS=()=>({url:location.origin+location.pathname+'?verified=1'});
q('#np_ok').onclick=e=>{const b=e.currentTarget;return run(b,rsF3,async()=>{
  const p1=q('#np1').value;
  if(!rsCode)throw{code:'auth/invalid-action-code'};
  if(!p1)throw{code:'app/pw-new-empty'};
  if(p1.length<6)throw{code:'auth/weak-password'};
  if(!q('#np2').value)throw{code:'app/pw2-empty'};
  if(p1!==q('#np2').value)throw{code:'app/pw-match'};
  const em=rsMail;
  await animRun(b,async()=>{await confirmPasswordReset(auth,rsCode,p1);rsClear();return 1},()=>{resetRs();lgF.username.value=em;lgF.password.value='';noForgot();say(lgF,'Password changed. Please log in.',1);loginIn()})},false)};
q('#rs4_go').onclick=e=>{const b=e.currentTarget;return run(b,rsF4,async()=>{
  await animRun(b,async()=>{const d=rsSaved();if(!d)throw{code:'auth/invalid-action-code'};await verifyPasswordResetCode(auth,d.code);return d},showRs3)},false)};
const rsChoice=c=>{const d=rsSaved();if(d){try{localStorage.setItem(RK,JSON.stringify({...d,choice:c}))}catch(e){}}};
q('#rs4_yes').onclick=()=>{rsChoice('yes');gsap.to(rsF4,{opacity:0,duration:.25,onComplete:()=>{
  q('#rs4_q').textContent='Great. Now go back to the Ultimate Tour app and tap Verify to enter your new password. Cannot find it? Continue here.';
  q('#rs4_yes').style.display='none';q('#rs4_no').style.display='none';q('#rs4_go').style.display='';gsap.to(rsF4,{opacity:1,duration:.4})}})};
q('#rs4_no').onclick=()=>{rsChoice('no');
  gsap.to(rs4,{opacity:0,duration:.4,onComplete:()=>{rs4.style.display='none';gsap.set(rs4,{opacity:1});lgF.password.value='';say(lgF,'No changes were made to your password.',1);loginIn()}})};
addEventListener('storage',e=>{try{if(e.key===RK&&e.newValue&&JSON.parse(e.newValue).choice&&rs2.style.display==='flex')q('#rs_st').textContent='Done on the link page. Tap the button below to continue.'}catch(x){}});
// Came back from Firebase's email-verified page: Create box spins, then expands into the home page
if(VERIFIED){history.replaceState(null,'',location.pathname);skipIntro();
  (async()=>{
    const until=f=>new Promise(r=>{const w=()=>f()?r():setTimeout(w,50);w()});
    await auth.authStateReady();await introDone();
    const u=auth.currentUser;
    if(!u){say(lgF,'Email verified. Log in to continue.',1);loginIn();return}
    try{await u.reload()}catch(x){}
    if(!u.emailVerified){showVerify(u);return}
    try{const d=JSON.parse(localStorage.getItem(PK)||'null');if(d){q('#su_name').value=d.name||'';q('#su_username').value=d.username||'';q('#su_email').value=d.email||'';q('#su_phone').value=d.phone||''}}catch(x){}
    goSignup(q('#login .signup button'));
    await until(sgOn);await new Promise(r=>setTimeout(r,1700));
    working=true;
    try{await animRun(q('#sgf .btn'),async()=>await getProfile(u)||await makeProfile(u),enter)}
    catch(err){say(sgF,E[err.code]||'Something went wrong ('+(err.code||err.message)+')')}
    finally{working=false}
  })()}
// Reset link opened (Firebase action URL set to this page): go straight to the new password page and tell the other tab
{const qs=new URLSearchParams(location.search),code=qs.get('oobCode');
 if(qs.get('mode')==='resetPassword'&&code){
  verifyPasswordResetCode(auth,code).then(async em=>{
    try{localStorage.setItem(RK,JSON.stringify({code,email:em.toLowerCase()}))}catch(e){}
    history.replaceState(null,'',location.pathname);await introDone();rs4.style.display='flex';popIn(document.querySelectorAll('#rs4 .lg>*'))
  }).catch(async()=>{history.replaceState(null,'',location.pathname);await introDone();say(lgF,'Reset link invalid or already used.')})}}
