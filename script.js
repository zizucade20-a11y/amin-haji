history.scrollRestoration="manual";scrollTo(0,0);
/* ===== PHOTOS: paste your image links between the quotes, then save and open this file ===== */
const PHOTOS={hero:"",paddock:"",footer:"",y2012:"",y2015:"",y2019:"",y2021:"",y2024:"",y2025:"",y2026:""};
(function(){
 const mk=(src,css)=>{const i=new Image();i.src=src;i.alt="";i.style.cssText="position:absolute;object-fit:cover;"+css;return i};
 document.querySelectorAll(".pl").forEach(p=>{const y=p.querySelector(".yr"),u=y&&PHOTOS["y"+y.dataset.split];if(!u)return;
  const a=p.querySelector(".art");a&&a.remove();p.querySelector(".ph").appendChild(mk(u,"inset:0;width:100%;height:100%"))});
 const put=(key,sel,css)=>{const u=PHOTOS[key],t=document.querySelector(sel);if(!u||!t)return;t.parentNode.insertBefore(mk(u,css),t);t.remove()};
 put("hero",".hf","right:0;bottom:0;height:100%;width:55%;z-index:1;-webkit-mask-image:linear-gradient(to left,#000 60%,transparent);mask-image:linear-gradient(to left,#000 60%,transparent)");
 put("paddock",".pf","right:10cqw;bottom:max(11.7cqw,9rem);width:46cqw;height:24cqw;z-index:10;-webkit-mask-image:linear-gradient(to bottom,#000 70%,transparent);mask-image:linear-gradient(to bottom,#000 70%,transparent)");
 put("footer",".ff","left:50%;top:0;transform:translateX(-50%);width:60%;height:50%;z-index:10;opacity:.5");
})();

const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
/* shared ticker */
const subs=new Set();let raf=0;
const tick=t=>{subs.forEach(f=>f(t));raf=requestAnimationFrame(tick)};
const sub=f=>{subs.add(f);if(!raf)raf=requestAnimationFrame(tick);return()=>{subs.delete(f);if(!subs.size){cancelAnimationFrame(raf);raf=0}}};
/* spring: react-spring solver, 1ms substeps, 64ms cap */
function spring(el,{tension,friction,delay=0,from,to,apply,done}){
 let v=0,x=0,start=performance.now()+delay,last=0;
 apply(from);
 const off=sub(t=>{
  if(t<start)return;
  let dt=Math.min(64,last?t-last:16);last=t;
  for(let i=0;i<dt;i++){const f=-tension*(x-1)-friction*v;v+=f/1000;x+=v/1000}
  apply(x);
  if(Math.abs(v)<.01&&Math.abs(1-x)<.001){apply(1);off();done&&done()}
 });
}
/* text engine: words, once in view */
function split(el){
 const text=el.dataset.split;el.setAttribute("aria-label",text);
 const wrap=document.createElement("span");wrap.className="wrap";wrap.setAttribute("aria-hidden","true");
 if(el.classList.contains("yr")){wrap.style.columnGap="0";text.split("").forEach(c=>{const s=document.createElement("span");s.className="w";s.textContent=c;s.dataset.y=".3";wrap.appendChild(s)})}
 else text.split(" ").forEach(w=>{const s=document.createElement("span");s.className="w";s.textContent=w;wrap.appendChild(s)});
 if(el.hasAttribute("data-dot")){wrap.lastChild.textContent=wrap.lastChild.textContent.replace(/\.$/,"");const d=document.createElement("em");d.className="w";d.textContent=".";d.style.display="inline-block";wrap.lastChild.after(d);wrap.style.columnGap="0";wrap.lastChild.previousSibling.style.marginRight=".3em"}
 el.textContent="";el.appendChild(wrap);
 if(el.classList.contains("disp")||el.tagName==="SPAN")el.style.display="block";
 return[...wrap.children];
}
const stag=el=>el.hasAttribute("data-fast")?34:el.classList.contains("yr")?26:110;
const units=new Map();
document.querySelectorAll("[data-split]").forEach(el=>{units.set(el,split(el))});
const run=(el,i0=0)=>{const us=units.get(el);const g=stag(el);us.forEach((u,i)=>{const y=u.dataset.y?".3em":".35em";spring(u,{tension:90,friction:26,delay:i0+i*g,from:0,to:1,apply:p=>{u.style.opacity=Math.min(1,p);u.style.transform=`translateY(${(1-p)*parseFloat(y)}em)`}})})};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!e.target._d){e.target._d=1;run(e.target)}}),{rootMargin:"0% 0% -15% 0%"});
units.forEach((_,el)=>{if(!el.closest("[data-hero]"))io.observe(el)});
/* veil, then hero entrance */
const veil=document.getElementById("veil"),vh=veil.querySelector(".h i"),vb=veil.querySelector("b i");
let prog=0;const veilOff=sub(()=>{prog+=(.7-prog)*.04;vh.style.transform=`scaleY(${prog})`;vb.style.transform=`scaleX(${prog})`});
function lift(){veilOff();let p=prog;const o=sub(()=>{p+=(1-p)*.2;vh.style.transform=`scaleY(${p})`;vb.style.transform=`scaleX(${p})`;if(p>.995){o();setTimeout(()=>{veil.style.opacity=0;enter();setTimeout(()=>veil.remove(),800)},430)}})}
function enter(){
 const h=document.querySelector("[data-hero]");
 h.querySelectorAll("[data-split]").forEach(el=>run(el,180));
 const rise=(sel,d)=>document.querySelectorAll(sel).forEach(el=>spring(el,{tension:90,friction:26,delay:d,from:0,to:1,apply:p=>{el.style.opacity=Math.min(1,p);el.style.transform=`translateY(${(1-p)*1.25}rem)`}}));
 rise(".mast",0);rise(".meta li",440);rise(".pan",900);rise(".foot",1500);
}
document.querySelectorAll(".mast,.meta li,.pan,.foot").forEach(e=>e.style.opacity=0);
addEventListener("load",()=>setTimeout(lift,RM?0:700));
/* contours: marching squares of the four-sine field */
const CE=96,LS=3.8,LC=2.5,WA=.37,WS=1.66,LO=.85;
const fld=(x,y,t)=>{let f=Math.sin(x+t*.6)*.5;f+=Math.sin(y*.85-t*.45)*.45;f+=Math.sin((x+y)*.65+t*.35)*.35;f+=Math.sin((x-y)*.95-t*.55)*.25;return f*.5+.5};
document.querySelectorAll("canvas.ct").forEach(cv=>{
 const cx=cv.getContext("2d");let vis=false,t0=performance.now(),last=0;
 new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(cv);
 const size=()=>{const r=Math.min(devicePixelRatio,2);cv.width=cv.clientWidth*r;cv.height=cv.clientHeight*r;cx.setTransform(r,0,0,r,0,0)};size();addEventListener("resize",size);
 sub(now=>{
  if(!vis||now-last<24)return;last=now;
  const W=cv.clientWidth,H=cv.clientHeight;if(!W)return;
  const t=(now-t0)/1000*WS,cols=W>=H?CE:Math.max(8,Math.round(CE*W/H)),rows=Math.max(8,Math.round(cols*H/W)),sx=W/cols,sy=H/rows,asp=W/H,v=new Float32Array((cols+1)*(rows+1));
  for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){const nx=((i/cols)*2-1)*asp*LS,ny=((j/rows)*2-1)*LS,qx=nx+Math.sin(ny*.8+t*.7)*WA,qy=ny+Math.cos(nx*.7-t*.6)*WA;v[j*(cols+1)+i]=fld(qx,qy,t)*LC}
  cx.clearRect(0,0,W,H);cx.strokeStyle=cv.dataset.c;cx.lineWidth=1;cx.globalAlpha=+cv.dataset.a*(LO/.85);cx.beginPath();
  for(let L=.5;L<LC;L++)for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
   const a=v[j*(cols+1)+i],b=v[j*(cols+1)+i+1],c=v[(j+1)*(cols+1)+i+1],d=v[(j+1)*(cols+1)+i];
   const k=(a>L?8:0)|(b>L?4:0)|(c>L?2:0)|(d>L?1:0);if(!k||k===15)continue;
   const x0=i*sx,y0=j*sy,T=[x0+sx*((L-a)/(b-a)),y0],R=[x0+sx,y0+sy*((L-b)/(c-b))],B=[x0+sx*((L-d)/(c-d)),y0+sy],Lf=[x0,y0+sy*((L-a)/(d-a))];
   const s=(p,q)=>{cx.moveTo(p[0],p[1]);cx.lineTo(q[0],q[1])};
   switch(k){case 1:case 14:s(Lf,B);break;case 2:case 13:s(B,R);break;case 3:case 12:s(Lf,R);break;case 4:case 11:s(T,R);break;case 6:case 9:s(T,B);break;case 7:case 8:s(Lf,T);break;case 5:s(Lf,T);s(B,R);break;case 10:s(Lf,B);s(T,R)}
  }
  cx.stroke();cx.globalAlpha=1;
 });
});
/* sticky stack: recede */
const pinned=[...document.querySelectorAll("#stack .lay")].slice(0,2).map((l,i)=>({inner:l.querySelector(".in"),shade:l.querySelector(".shade"),next:document.querySelectorAll("#stack .lay")[i+1]}));
const phone=matchMedia("(max-width:639px)");let pend=0;
const apply=()=>{pend=0;const view=innerHeight||1,shrink=phone.matches?0:.1;
 for(const{inner,shade,next}of pinned){const p=Math.min(1,Math.max(0,1-next.getBoundingClientRect().top/view));
  inner.style.transform=p>0&&shrink>0?`scale(${1-shrink*p})`:"";shade.style.opacity=.55*p;inner.style.visibility=p>=1?"hidden":"visible"}};
addEventListener("scroll",()=>{if(!pend){pend=1;requestAnimationFrame(apply)}},{passive:true});addEventListener("resize",apply);apply();
/* season: ping, grid crawl, globe, one 6s lap */
const lap=document.getElementById("lap"),sec=document.getElementById("season"),grid=document.getElementById("grid"),ping=document.getElementById("ping"),mer=document.getElementById("mer"),rule=document.querySelector(".rule");
let lapDone=false,vs=false;
new IntersectionObserver(e=>{vs=e[0].isIntersecting;if(vs&&!lapDone){lapDone=true;const s=performance.now();const o=sub(n=>{let u=Math.min(1,(n-s)/6000);const e=-(Math.cos(Math.PI*u)-1)/2;lap.style.strokeDashoffset=1-e;if(u>=1)o()});spring(rule,{tension:140,friction:26,delay:260,from:0,to:1,apply:p=>{rule.style.transform=`scaleX(${p})`}})}},{threshold:.35}).observe(sec);
sub(n=>{if(!vs)return;grid.style.strokeDashoffset=-((n%7000)/7000)*20.5;const v=(n%4200)/4200,e=1-(1-v)*(1-v);ping.setAttribute("r",10.6+e*86);ping.setAttribute("opacity",.4*(1-e)*(1-e));mer.setAttribute("rx",Math.max(.5,Math.abs(Math.cos((n%10000)/10000*Math.PI*2))*18))});
/* timeline: rail thread, dim on hover */
const tl=document.getElementById("tl"),rail=document.getElementById("rail"),thr=rail.querySelector("i"),mk=rail.querySelector("u");
const rows=[...tl.querySelectorAll(".row")];
rows.forEach(r=>{const p=r.querySelector(".pl");p.addEventListener("mouseenter",()=>{if(matchMedia("(hover:hover)").matches){tl.classList.add("dim");r.classList.add("on")}});p.addEventListener("mouseleave",()=>{tl.classList.remove("dim");r.classList.remove("on")})});
sub(()=>{const b=tl.getBoundingClientRect();if(b.bottom<0||b.top>innerHeight)return;
 const last=rows[rows.length-1],lr=last.getBoundingClientRect(),rest=lr.top-b.top+lr.height/2-50,start=innerHeight/2,end=b.height-innerHeight*0+0;
 let p=Math.min(1,Math.max(0,(innerHeight/2-b.top)/(Math.max(1,b.height-innerHeight/2))));p=Math.min(1,p*1.05);
 const run=p*rest;thr.style.height=run+"px";mk.style.transform=`translateY(${run}px) rotate(${p*1800}deg)`});
/* calendar: crawl connectors toward the live round */
const lks=[...document.querySelectorAll(".lk")];let pv=false;
new IntersectionObserver(e=>pv=e[0].isIntersecting).observe(document.getElementById("cal"));
sub(n=>{if(!pv)return;const u=(n%5200)/5200;lks.forEach((l,i)=>{const w=l.getBoundingClientRect().width,per=w*0.0+ (innerWidth*.008);l.style.setProperty("--cr",(i<2?1:-1)*u*per+"px")})});
/* illustrations: bob, spin, gleam, pointer lean */
const arts=[...document.querySelectorAll(".art")];let mx=0;
const seen=new WeakMap();
const aio=new IntersectionObserver(es=>es.forEach(e=>seen.set(e.target,e.isIntersecting)));arts.forEach(a=>aio.observe(a));
addEventListener("pointermove",e=>mx=e.clientX/innerWidth*2-1,{passive:true});
sub(n=>{arts.forEach((a,i)=>{if(!seen.get(a))return;
 const car=a.innerHTML.includes("#car")||a.innerHTML.includes("#kart");
 a.style.setProperty("--rot",(n/(car?1.6:9)%360)+"deg");
 a.style.setProperty("--sp",(.35+.4*Math.abs(Math.sin(n/140+i))).toFixed(2));
 a.style.setProperty("--gl",(.25+.6*Math.max(0,Math.sin(n/700+i))).toFixed(2));
 const hero=a.classList.contains("hf");
 a.style.translate=`${hero?mx*14:Math.sin(n/1500+i)*(car?7:0)}px ${Math.sin(n/700+i)*(hero?6:3)}px`;
})});