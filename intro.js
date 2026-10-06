// @@LOADING - intro animation: scenes, timeline, start()  (down to the eye toggle)
const $=s=>document.querySelector(s),p2=n=>String(n).padStart(2,'0');
const SPEED=1; // 1 = normal, 1.5 = faster
// [glyph, title, sub, landscape x,y,rot, portrait x,y,rot]  (x,y in rem from screen center)
const CHIPS=[
['‹›','All Ai Agents Pro','Api . OB . 01.00',-30,-16,-5,-18,-17,-5],
['◔','Support Agent','High - 01.00',0,-19,-2,0,-26,-2],
['▤','Dashboard Auto','High - 01.00',30,-16,4,19,-18,4],
['▥','Analysis Agent','Pro . OB',-34,8,4,-19,18,4],
['▣','Security Agent','Max - Go',34,8,-4,19,19,-4],
['◉','Automation','On 0.10 Pro',-20,19,-3,-12,27,-3],
['▦','Payment Pro','Instant-01.00',20,19,5,17,28,5]];

// build DOM pieces
$('#g').innerHTML='<div class="arm"><i class="b"></i><i class="d"></i></div>'.repeat(8);
$('#word').innerHTML=[...'Ultimate Tour'].map(c=>`<span class="l">${c==' '?'&nbsp;':c}</span>`).join('');
const D=[];
for(let i=0;i<16;i++){const e=document.createElement('i'),s=.5+Math.random()*1.4;e.style.cssText=`width:${s}rem;height:${s}rem;background:${i%4?'var(--ink)':'var(--lime)'}`;$('#deb').append(e);D.push(e)}

const lab=$('#lab'),clk=$('#clk'),tw=$('#tw');
const fmt=v=>{v=Math.round(v);return [v/3600|0,(v%3600)/60|0,v%60].map(p2).join(':')};
const toC=(e,y)=>{const r=e.getBoundingClientRect();return y?innerHeight/2-r.top-r.height/2:innerWidth/2-r.left-r.width/2};
let tl;
window.AUTO={state:'wait',cb:null}; // set by the module: 'home' = already logged in (open home straight after the intro), 'login' = show login
function tick(){const t=tl.time();$('#tc').textContent=`TC 00:00:${p2(Math.floor(t))}:${p2(Math.floor((t%1)*60))}`;$('#bar').style.width=tl.progress()*100+'%'}
function done(){dispatchEvent(new Event('loader:done'))}

function build(){
  const u=parseFloat(getComputedStyle(document.documentElement).fontSize),H=innerHeight;
  const P=innerWidth<innerHeight,o=P?6:3;
  CHIPS.forEach(c=>$('#cl').insertAdjacentHTML('beforeend',`<div class="chip" style="left:calc(50% + ${c[o]}rem);top:calc(50% + ${c[o+1]}rem)" data-r="${c[o+2]}"><b>${c[0]}</b><div><strong>${c[1]}</strong><small>${c[2]}</small></div></div>`));
  gsap.set('.arm',{rotation:i=>i*45});
  gsap.set('.chip',{xPercent:-50,yPercent:-50,rotation:(i,e)=>+e.dataset.r});
  gsap.set(D,{xPercent:-50,yPercent:-50});
  gsap.set('#pill',{xPercent:-50});
  gsap.set('#hl',{rotation:-.8});
  gsap.set('.band',{xPercent:i=>i<3?-105:105});
  tl=gsap.timeline({paused:true,onUpdate:tick,onComplete:done});
  tl.timeScale(SPEED);

  // 0 — white page, HUD fades in
  tl.to('#stage',{backgroundColor:'#f4efe9',duration:.6},0)
    .fromTo('#hud',{opacity:0},{opacity:1,duration:1,ease:'power2.out'},1.0)
    .fromTo('.tl,.tr,.top',{y:-1.2*u},{y:0,duration:1.1,ease:'power3.out'},1.0)
    .fromTo('.bl,.br,.bot',{y:1.2*u},{y:0,duration:1.1,ease:'power3.out'},1.0);

  // 1 — lime ball drops, bounces
  tl.fromTo('#ball',{y:-(H/2+3*u)},{y:0,duration:.7,ease:'power2.in'},.25)
    .fromTo('#sh',{opacity:0,scale:.3},{opacity:1,scale:1,duration:.7,ease:'power2.in'},.25)
    .to('#ball',{scaleX:1.35,scaleY:.65,duration:.07},.95)
    .to('#ball',{y:-6*u,scaleX:.92,scaleY:1.08,duration:.3,ease:'power2.out'},1.02)
    .to('#sh',{scale:.55,opacity:.5,duration:.3,ease:'power2.out'},1.02)
    .to('#ball',{y:0,scaleX:1,scaleY:1,duration:.22,ease:'power2.in'},1.32)
    .to('#sh',{scale:1,opacity:1,duration:.22,ease:'power2.in'},1.32);

  // 2 — burst into the shape
  const B=1.54;
  tl.to('#ball',{scale:1.25,duration:.1,yoyo:true,repeat:1},B)
    .to('#sh',{opacity:0,duration:.3},B)
    .set('#r1',{opacity:1,scale:.15},B).to('#r1',{scale:2,opacity:0,duration:1,ease:'power2.out'},B)
    .set('#r2',{opacity:.8,scale:.2},B+.1).to('#r2',{scale:1.15,opacity:0,duration:1.2,ease:'power2.out'},B+.1)
    .fromTo('.b',{scaleX:0},{scaleX:1,duration:.45,stagger:.025,ease:'back.out(1.8)'},B+.08)
    .fromTo('.d',{scale:0,x:-5*u},{scale:1,x:0,duration:.55,stagger:.03,ease:'back.out(2)'},B+.08);
  D.forEach(e=>{const a=Math.random()*6.283,r=(5+Math.random()*10)*u;
    tl.set(e,{opacity:1,x:0,y:0,scale:1},B).to(e,{x:Math.cos(a)*r,y:Math.sin(a)*r,scale:.3,opacity:0,duration:1+Math.random()*.5,ease:'power3.out'},B)});
  const msg='> All Ultimate Servers - Online',T={n:0};
  tl.set('#tw',{opacity:1},B+.5).to(T,{n:msg.length,duration:.9,ease:'none',onUpdate:()=>{tw.textContent=msg.slice(0,Math.round(T.n))+'▌'}},B+.5);

  // 3 — spin with orbit, then collapse
  tl.to('#g',{rotation:180,duration:.95,ease:'power3.inOut'},2.15)
    .to('#g',{filter:'blur(2.5px)',duration:.25,yoyo:true,repeat:1},2.3)
    .set('#orb',{opacity:1,scale:.6,rotation:-30},2.15).to('#orb',{scale:1,rotation:-16,duration:.5,ease:'power2.out'},2.15).to('#orb',{opacity:0,duration:.3},2.8)
    .to('#tw',{opacity:0,duration:.2},3.2)
    .to('.d',{x:-3.2*u,scale:.55,duration:.35,ease:'power2.in'},3.3)
    .to('#g',{scale:.6,filter:'blur(1.5px)',duration:.35,ease:'power2.in'},3.3);

  // 4 — lime flood, cream circle opens
  tl.to('#flood',{clipPath:'circle(75% at 50% 50%)',duration:.4,ease:'power3.in'},3.65)
    .set('#s1',{visibility:'hidden'},4.05)
    
    .to('#hole',{clipPath:'circle(75% at 50% 50%)',duration:.55,ease:'power3.out'},4.05)
    .set('#s2',{visibility:'visible'},4.05);

  // 5 — "Deadline", timer, highlight, chips
  const C={v:10*3600};clk.textContent=fmt(C.v);
  tl.fromTo('.l',{yPercent:115,rotation:7,skewX:-10,opacity:0},{yPercent:0,rotation:0,skewX:0,opacity:1,duration:.75,stagger:.04,ease:'power3.out'},4.25)
    .fromTo('#pill',{opacity:0,scale:.6},{opacity:1,scale:1,duration:.5,ease:'back.out(2)'},4.75)
    .to(C,{v:0,duration:1.4,ease:'power2.out',onUpdate:()=>{clk.textContent=fmt(C.v)}},4.85)
    .to('#clk',{color:'#ff7a45',duration:.2},6.25).to('#pdot',{backgroundColor:'#ff7a45',duration:.2},6.25)
    .fromTo('#hl',{scaleX:0},{scaleX:1,duration:.5,ease:'power3.inOut'},5.4)
    .fromTo('.chip',{opacity:0,scale:.5,y:3*u},{opacity:1,scale:1,y:0,duration:.5,stagger:.08,ease:'back.out(1.8)'},5.5);

  // 6 — everything whirls into the center and out
  const X=6.9;
  tl.to('.chip',{x:(i,e)=>toC(e,0),y:(i,e)=>toC(e,1),scale:.3,opacity:0,filter:'blur(6px)',duration:.5,stagger:.03,ease:'power3.in'},X)
    .to('.l',{yPercent:-120,skewX:8,opacity:0,filter:'blur(6px)',duration:.4,stagger:.015,ease:'power3.in'},X+.1)
    .to('#pill,#hl',{opacity:0,scale:.7,duration:.3},X+.05)
    .set('#t2',{visibility:'visible'},X+.45)
    .set('#s2',{visibility:'hidden'},X+.7);

  // 7 — tagline
  const Y=X+.5;
  tl.fromTo('#a1',{yPercent:110},{yPercent:0,duration:.6,ease:'power4.out'},Y)
    .fromTo('#a2',{yPercent:110},{yPercent:0,duration:.6,ease:'power4.out'},Y+.12)
    .to('#mk',{backgroundSize:'100% 60%',duration:.5,ease:'power3.inOut'},Y+.5);

  // 8 — glitch stair-step to black
  tl.to('.band',{xPercent:0,duration:.8,stagger:i=>[0,2,4,1,3,5][i]*.09,ease:'power3.inOut'},Y+1.7);

  // 9 — brief black, strips leave the opposite way; login boxes show, then texts float up top→bottom
  const cover=Y+1.7+.8+.45,go=cover+.02;
  tl.call(()=>{if(AUTO.state!=='wait')return;tl.pause();const tm=setTimeout(()=>{AUTO.state='login';AUTO.cb()},5000);AUTO.cb=()=>{clearTimeout(tm);AUTO.cb=null;tl.play()}},null,cover-.02)
    .set('#login',{visibility:'visible'},cover)
    .call(()=>{if(AUTO.state==='home'&&AUTO.show)AUTO.show()},null,cover+.01)
    .set('#hud',{autoAlpha:0},cover)
    .to('.band',{xPercent:i=>i<3?105:-105,duration:.7,stagger:i=>[0,2,4,1,3,5][i]*.07,ease:'power2.inOut'},go)
    .call(()=>{if(AUTO.state==='home'&&AUTO.reveal)AUTO.reveal()},null,go+.15)
    .fromTo('.field,.btn,.gbtn',{y:20,opacity:0},{y:0,opacity:1,duration:.8,ease:'power3.out',stagger:.1,clearProps:'transform'},go+.05)
    .fromTo('.tt',{y:14,opacity:0},{y:0,opacity:1,duration:.7,ease:'power3.out',stagger:(i,el)=>el.dataset.g*.14},go+.85);
}

// @@LOGIN - password eye toggle on the login page
const eye=$('#eye'),pw=$('#pw');
eye.addEventListener('pointerdown',e=>e.preventDefault());
eye.onclick=()=>{const on=pw.type==='password';pw.type=on?'text':'password';eye.setAttribute('aria-pressed',on);eye.setAttribute('aria-label',on?'Hide password':'Show password')};
// @@SIGNUP - signup form template + burst transitions goSignup()/goLogin()
// ---------- Create account: underline -> ball -> burst -> signup ----------
const EYE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1.5 12S5.5 4.5 12 4.5 22.5 12 22.5 12 18.5 19.5 12 19.5 1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/><path class="sl" pathLength="1" d="M3.5 3.5l17 17"/></svg>';
const FD=[[2,'Aa','Full Name','text','name','your full name','name'],
[3,'@','Username','text','username','choose a username','username'],
[4,'G','Gmail','email','email','you@gmail.com','email'],
[5,'#','Phone Number · Optional','tel','phone','01XXXXXXXXX','tel'],
[6,'***','Password','password','pw1','••••••••','new-password',1],
[7,'✓','Confirm Password','password','pw2','••••••••','new-password',1]];
$('#sgf').innerHTML='<h2 class="ttl st" data-g="0">Ultimate <span class="hl">Tour</span></h2><p class="sub st" data-g="1">Create new account</p>'
+FD.map(f=>`<label class="field"><i class="ic"><b class="st" data-g="${f[0]}">${f[1]}</b></i><span class="tx"><small class="st" data-g="${f[0]}">${f[2]}</small><input class="st" data-g="${f[0]}" id="su_${f[4]}" type="${f[3]}" name="${f[4]}" autocomplete="${f[6]}" autocapitalize="none" spellcheck="false" placeholder="${f[5]}"></span>${f[7]?`<button class="eye st" data-t="su_${f[4]}" data-g="${f[0]}" type="button" aria-label="Show password" aria-pressed="false">${EYE}</button>`:''}<i class="glow"></i></label>`).join('')
+'<p class="msg slot"></p><button class="btn" type="button"><i class="st" data-g="8"></i><span class="st" data-g="8">Create</span></button><button class="gbtn" type="button">'+`<svg class="st" data-g="9" viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.2 5.5-4.7 7.2l7.6 5.9c4.4-4.1 6.9-10.1 6.9-17.6z"/><path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.100 0 24s.9 7.600 2.600 10.800l7.900-6.100z"/><path fill="#34A853" d="M24 48c6.500 0 11.900-2.100 15.900-5.800l-7.600-5.900c-2.100 1.400-4.900 2.300-8.300 2.300-6.300 0-11.600-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z"/></svg>`+'<span class="st" data-g="9">Continue with Google</span></button><p class="signup st" data-g="10">Already have an account - <button type="button" id="back">Log in</button></p>';
addEventListener('pointerdown',e=>{if(e.target.closest('.eye[data-t]'))e.preventDefault()});
addEventListener('click',e=>{const b=e.target.closest('.eye[data-t]');if(!b)return;const i=$('#'+b.dataset.t),on=i.type==='password';i.type=on?'text':'password';b.setAttribute('aria-pressed',on);b.setAttribute('aria-label',on?'Hide password':'Show password')});

const XD=[];
let busy=false;
const kids=()=>[...document.querySelectorAll('#login .lg>*')];

function goSignup(btn){
  if(busy)return;busy=true;
  document.activeElement&&document.activeElement.blur();
  const r=btn.getBoundingClientRect(),W=innerWidth,H=innerHeight,SX=r.left+r.width/2,SY=r.bottom-1,EX=W/2,EY=H/2;
  const ub=$('#ub'),xf=$('#xf'),xc=$('#xc'),fx=$('#fx'),su=$('#signup'),lg=$('#login'),P={k:0};
  const RM=Math.hypot(W,H)/2*1.06,T0=1.75; // T0 = the moment the ball reaches the center
  su.scrollTop=0;
  gsap.set(su,{visibility:'hidden',clipPath:'none',opacity:1,backgroundColor:'rgba(244,239,233,0)'});
  gsap.set('#signup .field,#signup .btn,#signup .gbtn',{opacity:0,y:20});
  gsap.set('#signup .st',{opacity:0,y:14});
  gsap.set(ub,{visibility:'visible',x:SX,y:SY,xPercent:-50,yPercent:-50,width:r.width,height:2,borderRadius:1,scale:1,opacity:1,backgroundImage:'none',boxShadow:'0 0 22px rgba(201,222,60,.8)',force3D:true});
  for(const e of [xf,xc]){gsap.set(e,{width:RM*2,height:RM*2,marginLeft:-RM,marginTop:-RM,scale:0,visibility:'visible',force3D:true})}
  gsap.set(btn,{borderBottomColor:'transparent',display:'inline-block',transformOrigin:'50% 100%'});
  // burst pieces (transform + opacity only = GPU smooth)
  const mk=(css)=>{const i=document.createElement('i');i.style.cssText=css;fx.appendChild(i);return i};
  const rings=[0,1].map(n=>mk('width:400px;height:400px;margin:-200px 0 0 -200px;border:4px solid '+(n?'#0b0f10':'#c9de3c')+';opacity:0'));
  const dots=Array.from({length:16},(_,n)=>{const s=n%3===0?16:n%3===1?10:7;return mk('width:'+s+'px;height:'+s+'px;margin:-'+s/2+'px 0 0 -'+s/2+'px;background:'+(n%4===0?'#0b0f10':'#c9de3c')+';opacity:0')});
  gsap.set([...rings,...dots],{x:0,y:0,scale:0,force3D:true}); // #fx i are already centered via left/top:50%
  const cleanup=()=>{fx.innerHTML='';for(const e of [xf,xc])gsap.set(e,{clearProps:'all'});gsap.set(ub,{visibility:'hidden',clearProps:'boxShadow'});gsap.set(su,{clearProps:'backgroundColor'});busy=false};
  const t=gsap.timeline({defaults:{overwrite:false},onComplete:cleanup});
  // 1 text sucked into the underline, line rolls up into a ball
  t.set(ub,{backgroundImage:'radial-gradient(circle at 35% 30%,#eaf57a,#c9de3c 55%,#a3b81e)'},0)
   .to(btn,{scale:.04,y:r.height*.35,opacity:0,duration:.6,ease:'power2.inOut'},0)
   .to(ub,{width:30,height:30,borderRadius:15,duration:.6,ease:'power2.inOut'},0);
  // 2 spiral to the exact center
  t.to(P,{k:1,duration:T0-.6,ease:'power2.inOut',onUpdate:()=>{const k=P.k,a=k*Math.PI*2.2,A=70*Math.sin(Math.PI*k);
    gsap.set(ub,{x:SX+(EX-SX)*k+Math.cos(a)*A,y:SY+(EY-SY)*k+Math.sin(a)*A})}},.6);
  // 3 BURST: ball squeezes, then pops into shockwave rings + sparks while the lime wave rolls out
  t.to(ub,{scale:.7,duration:.16,ease:'power2.in'},T0-.02)
   .to(ub,{scale:2.6,opacity:0,duration:.34,ease:'expo.out'},T0+.14)
   .to(rings[0],{scale:1.7,duration:.35,ease:'expo.out'},T0+.14)
   .fromTo(rings[0],{opacity:.9},{opacity:0,duration:.4,ease:'power2.out'},T0+.14)
   .to(rings[1],{scale:1.15,duration:.35,ease:'expo.out'},T0+.18)
   .fromTo(rings[1],{opacity:.55},{opacity:0,duration:.4,ease:'power2.out'},T0+.18);
  dots.forEach((d,n)=>{const a=n/dots.length*Math.PI*2+(n%2?.18:0),dist=(n%2?170:290)+(n%3)*50;
    t.set(d,{opacity:1},T0+.14)
     .to(d,{x:Math.cos(a)*dist,y:Math.sin(a)*dist,scale:1,duration:.35,ease:'expo.out'},T0+.14)
     .to(d,{scale:0,opacity:0,duration:.15,ease:'power1.in'},T0+.22)}); // particles fully dissolved by T0+.5, before the lime wave grows over them
  // 4 login elements blast outward (no blur filter - that was the lag)
  kids().forEach((el,i)=>{el.style.transition='none';el.style.willChange='transform,opacity';const b=el.getBoundingClientRect(),dx=b.left+b.width/2-EX,dy=b.top+b.height/2-EY,d=Math.hypot(dx,dy)||1;
    t.to(el,{x:dx/d*W*.45,y:dy/d*H*.45,scale:.6,opacity:0,duration:.4,ease:'power3.in',force3D:true},T0+.12+.015*i)});
  // 5 lime wave = a scaled circle, then a cream wave opens the signup page
  t.to(xf,{scale:1,duration:.6,ease:'power3.inOut'},T0+.1)
   .add(()=>{lg.style.visibility='hidden';gsap.set(btn,{clearProps:'all'});kids().forEach(el=>{el.style.transition='';el.style.willChange='';gsap.set(el,{clearProps:'transform,opacity,filter'})});su.style.visibility='visible'},T0+.7)
   .to(xc,{scale:1,duration:.55,ease:'power3.inOut'},T0+.5)
   .set(su,{backgroundColor:'#f4efe9'},T0+1.05);
  // 6 boxes rise first, then texts float top to bottom
  const E=T0+.9;
  t.to('#signup .field,#signup .btn,#signup .gbtn',{y:0,opacity:1,duration:.8,ease:'power3.out',stagger:.1,clearProps:'transform'},E)
   .to('#signup .st',{y:0,opacity:1,duration:.7,ease:'power3.out',stagger:(i,el)=>el.dataset.g*.14},E+.8);
}
function goLogin(btn){
  if(busy)return;busy=true;
  document.activeElement&&document.activeElement.blur();
  const r=btn.getBoundingClientRect(),W=innerWidth,H=innerHeight,SX=r.left+r.width/2,SY=r.bottom-1,EX=W/2,EY=H/2;
  const ub=$('#ub'),xf=$('#xf'),xc=$('#xc'),fx=$('#fx'),su=$('#signup'),lg=$('#login'),P={k:0};
  const RM=Math.hypot(W,H)/2*1.06,T0=1.75;
  const sk=()=>[...document.querySelectorAll('#signup .lg>*')];
  lg.scrollTop=0;
  gsap.set(su,{zIndex:15,clipPath:'none',opacity:1,backgroundColor:'#f4efe9'}); // keep signup UNDER the lime wave (it was z52, hiding the green burst)
  gsap.set(lg,{visibility:'hidden',zIndex:52,backgroundColor:'rgba(244,239,233,0)'});
  gsap.set('#login .field,#login .btn,#login .gbtn',{opacity:0,y:20});
  gsap.set('#login .tt',{opacity:0,y:14});
  gsap.set(ub,{visibility:'visible',x:SX,y:SY,xPercent:-50,yPercent:-50,width:r.width,height:2,borderRadius:1,scale:1,opacity:1,backgroundImage:'none',boxShadow:'0 0 22px rgba(201,222,60,.8)',force3D:true});
  for(const e of [xf,xc]){gsap.set(e,{width:RM*2,height:RM*2,marginLeft:-RM,marginTop:-RM,scale:0,visibility:'visible',force3D:true})}
  gsap.set(btn,{borderBottomColor:'transparent',display:'inline-block',transformOrigin:'50% 100%'});
  const mk=(css)=>{const i=document.createElement('i');i.style.cssText=css;fx.appendChild(i);return i};
  const rings=[0,1].map(n=>mk('width:400px;height:400px;margin:-200px 0 0 -200px;border:4px solid '+(n?'#0b0f10':'#c9de3c')+';opacity:0'));
  const dots=Array.from({length:16},(_,n)=>{const s=n%3===0?16:n%3===1?10:7;return mk('width:'+s+'px;height:'+s+'px;margin:-'+s/2+'px 0 0 -'+s/2+'px;background:'+(n%4===0?'#0b0f10':'#c9de3c')+';opacity:0')});
  gsap.set([...rings,...dots],{x:0,y:0,scale:0,force3D:true});
  const cleanup=()=>{fx.innerHTML='';for(const e of [xf,xc])gsap.set(e,{clearProps:'all'});gsap.set(ub,{visibility:'hidden',clearProps:'boxShadow'});gsap.set(lg,{clearProps:'zIndex,backgroundColor'});gsap.set(su,{clearProps:'zIndex,backgroundColor'});busy=false};
  const t=gsap.timeline({defaults:{overwrite:false},onComplete:cleanup});
  // 1 text sucked into the underline, line rolls up into a ball
  t.set(ub,{backgroundImage:'radial-gradient(circle at 35% 30%,#eaf57a,#c9de3c 55%,#a3b81e)'},0)
   .to(btn,{scale:.04,y:r.height*.35,opacity:0,duration:.6,ease:'power2.inOut'},0)
   .to(ub,{width:30,height:30,borderRadius:15,duration:.6,ease:'power2.inOut'},0);
  // 2 smooth arc to the exact center (no spin): ball hops up and glides in, softly settling
  t.to(P,{k:1,duration:T0-.6,ease:'power3.inOut',onUpdate:()=>{const k=P.k,lift=H*.14*Math.sin(Math.PI*k);
    gsap.set(ub,{x:SX+(EX-SX)*k,y:SY+(EY-SY)*k-lift,scale:1+.25*Math.sin(Math.PI*k)})}},.6);
  // 3 burst
  t.to(ub,{scale:.7,duration:.16,ease:'power2.in'},T0-.02)
   .to(ub,{scale:2.6,opacity:0,duration:.34,ease:'expo.out'},T0+.14)
   .to(rings[0],{scale:1.7,duration:.35,ease:'expo.out'},T0+.14)
   .fromTo(rings[0],{opacity:.9},{opacity:0,duration:.4,ease:'power2.out'},T0+.14)
   .to(rings[1],{scale:1.15,duration:.35,ease:'expo.out'},T0+.18)
   .fromTo(rings[1],{opacity:.55},{opacity:0,duration:.4,ease:'power2.out'},T0+.18);
  dots.forEach((d,n)=>{const a=n/dots.length*Math.PI*2+(n%2?.18:0),dist=(n%2?170:290)+(n%3)*50;
    t.set(d,{opacity:1},T0+.14)
     .to(d,{x:Math.cos(a)*dist,y:Math.sin(a)*dist,scale:1,duration:.35,ease:'expo.out'},T0+.14)
     .to(d,{scale:0,opacity:0,duration:.15,ease:'power1.in'},T0+.22)});
  // 4 signup elements blast outward
  sk().forEach((el,i)=>{el.style.transition='none';el.style.willChange='transform,opacity';const b=el.getBoundingClientRect(),dx=b.left+b.width/2-EX,dy=b.top+b.height/2-EY,d=Math.hypot(dx,dy)||1;
    t.to(el,{x:dx/d*W*.45,y:dy/d*H*.45,scale:.6,opacity:0,duration:.4,ease:'power3.in',force3D:true},T0+.12+.015*i)});
  // 5 lime wave, then cream wave opens the login page
  t.to(xf,{scale:1,duration:.6,ease:'power3.inOut'},T0+.1)
   .add(()=>{su.style.visibility='hidden';gsap.set(btn,{clearProps:'all'});sk().forEach(el=>{el.style.transition='';el.style.willChange='';gsap.set(el,{clearProps:'transform,opacity,filter'})});gsap.set('#signup .st',{opacity:0});lg.style.visibility='visible'},T0+.7)
   .to(xc,{scale:1,duration:.55,ease:'power3.inOut'},T0+.5)
   .set(lg,{backgroundColor:'#f4efe9'},T0+1.05);
  // 6 boxes rise first, then texts float top to bottom
  const E=T0+.9;
  t.to('#login .field,#login .btn,#login .gbtn',{y:0,opacity:1,duration:.8,ease:'power3.out',stagger:.1,clearProps:'transform'},E)
   .to('#login .tt',{y:0,opacity:1,duration:.7,ease:'power3.out',stagger:(i,el)=>el.dataset.g*.14},E+.8);
}
const csb=$('#login .signup button');csb.onclick=()=>goSignup(csb);
const bk=$('#back');bk.onclick=()=>goLogin(bk);

function start(){build();tl.play(0)}
Promise.race([
  Promise.all(['italic 600 16px Newsreader','800 16px "Inter Tight"','700 16px "JetBrains Mono"'].map(f=>document.fonts.load(f))),
  new Promise(r=>setTimeout(r,1500))
]).then(start);
