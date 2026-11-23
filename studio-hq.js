
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const projects = [
 {name:"1AGE",type:"Blockchain discovery",description:"Search, discovery and interconnected 3D applications for the blockchain ecosystem.",url:"https://1age.com/",color:0x1bfd9c,x:-10,z:-7.5},
 {name:"NORTHLEFTCHEF",type:"Music and virtual creation",description:"A cosmic lo-fi studio and native beat-making experience in development.",url:"https://northleftchef.com/",color:0xd7a5ff,x:-5.2,z:-12},
 {name:"NO NAME BESUTO",type:"Solana FPS game",description:"A skill-based, laser-tag-style shooter in development. The current public prototype is not the finished game.",url:"https://nonamebesuto.com/",color:0xf3bd73,x:0,z:-14},
 {name:"IRK SMIFF",type:"Independent venture",description:"A separate hospitality and creative venture in the studio portfolio.",url:null,color:0x86abff,x:5.2,z:-12},
 {name:"NORTHLEFTVEST",type:"Apparel and upcycling",description:"A clothing and upcycling venture developed independently by the studio.",url:null,color:0xc1d4cb,x:10,z:-7.5}
];
const $ = (s) => document.querySelector(s);
const labels = $("#portal-labels"), modal = $("#modal"), panelTitle = $("#panel-title"), panelBody = $("#panel-body"), panelEyebrow = $("#panel-eyebrow"), panelActions = $("#panel-actions");
let lastFocused = null, current = 0;
const stage = $("#stage");
let renderer;
try {
 renderer = new THREE.WebGLRenderer({canvas:stage,antialias:true,alpha:false,powerPreference:"high-performance"});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,1.7));
 renderer.setSize(window.innerWidth,window.innerHeight);
 renderer.outputColorSpace = THREE.SRGBColorSpace;
 renderer.toneMapping = THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure = 1.32;
 document.documentElement.classList.add("is-3d");
 $("#experience-state").textContent = "3D STUDIO · LIVE SCENE";
} catch (error) {
 console.warn("WebGL unavailable; using accessible studio links.",error);
 $("#experience-state").textContent = "STUDIO DIRECTORY";
}
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function addProjectLabel(p,i){
 const el=document.createElement("button");el.className="portal-label";el.type="button";el.textContent=p.name;el.setAttribute("aria-label","Explore "+p.name);el.addEventListener("click",()=>showProject(i));labels.append(el);p.label=el;
}
projects.forEach(addProjectLabel);
function focusProject(i){current=i;$("#selected-name").textContent=projects[i].name;$("#selected-desc").textContent=projects[i].type;projects.forEach((p,j)=>p.label.classList.toggle("is-active",j===i));}
function openPanel(title,eyebrow,description,actions){
 lastFocused=document.activeElement;panelTitle.textContent=title;panelEyebrow.textContent=eyebrow;panelBody.textContent=description;panelActions.replaceChildren();
 for (const action of actions){
  const a=document.createElement("a");a.className="cta"+(action.secondary?" secondary":"");a.textContent=action.label;a.href=action.url;if(/^https?:/.test(action.url)){a.target="_blank";a.rel="noopener noreferrer";}panelActions.append(a);
 }
 modal.hidden=false;$("#modal-close").focus();
}
function showProject(i){
 focusProject(i);const p=projects[i];
 const actions=p.url?[{label:"OPEN PROJECT",url:p.url},{label:"STUDIO PORTFOLIO",url:"https://github.com/1AGEthe3rd",secondary:true}]:[{label:"STUDIO PORTFOLIO",url:"https://github.com/1AGEthe3rd",secondary:true}];
 openPanel(p.name,p.type.toUpperCase(),p.description,actions);
}
function showPortfolio(){
 panelTitle.textContent="Studio Portfolio";panelEyebrow.textContent="1AGETHE3RD · INDEPENDENT VENTURES";
 panelBody.textContent="Immersive worlds, applications, games, sound and apparel—built as distinct ventures by one virtual studio.";
 panelActions.replaceChildren();
 const grid=document.createElement("div");grid.className="projects";
 projects.forEach((p,i)=>{
  const btn=document.createElement("button");btn.type="button";btn.className="project-option";btn.textContent=p.name;
  const small=document.createElement("small");small.textContent=p.type;btn.append(small);btn.onclick=()=>showProject(i);grid.append(btn);
 });
 panelActions.append(grid);lastFocused=document.activeElement;modal.hidden=false;$("#modal-close").focus();
}
function showCapabilities(){
 openPanel("What We Build","VIRTUAL STUDIO","3D environments, interactive experiences, websites, game prototypes and independent digital ventures. We develop our own intellectual property and explore selective design, development and partnership opportunities.",[{label:"VIEW STUDIO WORK",url:"https://github.com/1AGEthe3rd"},{label:"EXPLORE 1AGE",url:"https://1age.com/",secondary:true}]);
}
function showContact(){
 openPanel("Work With The Studio","COLLABORATION","For prospective collaborations, project licensing or development inquiries, explore our public work and reach the studio through its current public GitHub profile. A dedicated studio contact channel is being prepared.",[{label:"OPEN GITHUB PROFILE",url:"https://github.com/1AGEthe3rd"}]);
}
function closePanel(){modal.hidden=true;lastFocused?.focus?.();}
$("#modal-close").onclick=closePanel;modal.addEventListener("pointerdown",e=>{if(e.target===modal)closePanel();});
document.querySelectorAll("[data-panel]").forEach(btn=>btn.addEventListener("click",()=>({portfolio:showPortfolio,capabilities:showCapabilities,contact:showContact}[btn.dataset.panel]||showPortfolio)()));
$("#open-selected").addEventListener("click",()=>showProject(current));
$("#brand-button").addEventListener("click",showPortfolio);
window.addEventListener("keydown",e=>{
 if(e.key==="Escape"&&!modal.hidden)closePanel();
 if(e.key.toLowerCase()==="m"&&modal.hidden)showPortfolio();
 if((e.key.toLowerCase()==="e"||e.key==="Enter")&&modal.hidden&&(document.activeElement===document.body||document.activeElement===stage))showProject(current);
});
focusProject(0);
if (!renderer) {
 $("#fallback").addEventListener("click",showPortfolio);
 $("#stage").setAttribute("aria-label","Studio project navigation is available from the Portfolio button.");
} else {
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x020709);scene.fog=new THREE.FogExp2(0x020709,.021);
 const camera=new THREE.PerspectiveCamera(68,innerWidth/innerHeight,.07,210);
 camera.position.set(0,2.45,15.5);camera.rotation.order="YXZ";
 let yaw=0,pitch=-.07;camera.rotation.set(pitch,yaw,0);
 scene.add(new THREE.HemisphereLight(0x6acfac,0x071013,1.75));
 const ambient=new THREE.AmbientLight(0xaac9b9,.42);scene.add(ambient);
 function light(color,power,x,y,z,range){const a=new THREE.PointLight(color,power,range,2);a.position.set(x,y,z);scene.add(a);return a;}
 light(0x1bfd9c,100,0,9,4,36);light(0xd9a66c,80,-11,6,-10,23);light(0xb790f0,75,11,6,-10,23);
 const mat=(color,metal=.05,rough=.55,emissive=0x000000,intensity=0)=>new THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough,emissive,emissiveIntensity:intensity});
 const black=mat(0x0a1114,.78,.24),stone=mat(0x141c1d,.52,.52),gold=mat(0xb09162,.85,.24),green=mat(0x0b4d38,.2,.3,0x1bfd9c,.55);
 function add(geo,material,x,y,z){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);scene.add(m);return m;}
 function box(w,h,d,x,y,z,m){return add(new THREE.BoxGeometry(w,h,d),m,x,y,z);}
 function cyl(rt,rb,h,x,y,z,m,n=36){return add(new THREE.CylinderGeometry(rt,rb,h,n),m,x,y,z);}
 // Architectural studio: a walkable gallery with luminous orbital gateways.
 box(44,.5,51,0,-.28,-4,black);
 for(let z=-22;z<=21;z+=4)box(42,.012,.018,0,.008,z,green);
 for(let x=-20;x<=20;x+=4)box(.018,.012,48,x,.01,-4,green);
 box(44,.32,50,0,12,-4,stone);
 for(let x of [-20,20])for(let z of [-19,-6,8,19]){
  box(.55,12,.55,x,6,z,black);cyl(.62,.62,.22,x,11.6,z,gold);cyl(.65,.65,.15,x,.3,z,gold);
 }
 box(43,12,.55,0,6,-22.5,black);
 for(let x of [-21.4,21.4])box(.4,12,50,x,6,-4,black);
 const edge=new THREE.MeshBasicMaterial({color:0x4ca77d});
 for(let x of [-19,19])box(.06,.07,48,x,.13,-4,edge);
 for(let y of [2.1,10.8])box(42,.07,.08,0,y,-22.1,edge);
 // Orbital centerpiece.
 cyl(4.6,4.6,.21,0,.18,4,stone,80);
 const ringMat=new THREE.MeshStandardMaterial({color:0xc8b481,emissive:0x5c3c12,emissiveIntensity:.25,metalness:.9,roughness:.23});
 const centerpiece=new THREE.Group();centerpiece.position.set(0,3.2,4);scene.add(centerpiece);
 for(let i=0;i<3;i++){
  const ring=new THREE.Mesh(new THREE.TorusGeometry(2.05+i*.37,.055,12,128),ringMat);
  ring.rotation.set(i*.8,.55+i*.64,0);centerpiece.add(ring);
 }
 const core=add(new THREE.IcosahedronGeometry(.75,2),mat(0x092a1d,.52,.1,0x1bfd9c,1.3),0,3.2,4);
 light(0x1bfd9c,90,0,4.8,4,17);
 // Abstract exterior world visible through the rear of the studio.
 const globe=add(new THREE.SphereGeometry(5.7,48,32),mat(0x093f33,.28,.65,0x164a3d,.25),0,7,-39);
 const gridGlobe=add(new THREE.SphereGeometry(5.78,24,15),new THREE.MeshBasicMaterial({color:0x58d6b2,wireframe:true,transparent:true,opacity:.19}),0,7,-39);
 const stars=[];let seed=157;const rand=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
 for(let i=0;i<600;i++)stars.push((rand()-.5)*140,rand()*65+5,-30-rand()*130);
 const sg=new THREE.BufferGeometry();sg.setAttribute("position",new THREE.Float32BufferAttribute(stars,3));scene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xdceee5,size:.11,transparent:true,opacity:.7})));
 const portals=[];
 projects.forEach((p,i)=>{
  const group=new THREE.Group();group.position.set(p.x,0,p.z);scene.add(group);
  const col=mat(0x061c18,.3,.4,p.color,.26),flare=new THREE.MeshBasicMaterial({color:p.color,transparent:true,opacity:.72,side:THREE.DoubleSide});
  const platform=new THREE.Mesh(new THREE.CylinderGeometry(2.32,2.55,.35,48),stone);platform.position.y=.12;group.add(platform);
  const base=new THREE.Mesh(new THREE.TorusGeometry(2.22,.08,10,80),flare);base.rotation.x=Math.PI/2;base.position.y=.32;group.add(base);
  const frame=new THREE.Mesh(new THREE.TorusGeometry(1.67,.17,14,80),gold);frame.position.y=2.43;group.add(frame);
  const aura=new THREE.Mesh(new THREE.TorusGeometry(1.55,.045,9,80),flare);aura.position.y=2.43;group.add(aura);
  const iris=new THREE.Mesh(new THREE.CircleGeometry(1.55,56),new THREE.MeshBasicMaterial({color:p.color,transparent:true,opacity:.075,side:THREE.DoubleSide,depthWrite:false}));iris.position.y=2.43;group.add(iris);
  const floating=new THREE.Mesh(new THREE.IcosahedronGeometry(.38,1),col);floating.position.y=2.43;group.add(floating);
  light(p.color,20,p.x,4.5,p.z,8);
  p.planet=floating;p.aura=aura;p.anchor=new THREE.Vector3(p.x,5.65,p.z);
  portals.push(group);
 });
 // Tablet, phone and external gamepad movement.
 const keys=new Set();const stick={move:{x:0,y:0},look:{x:0,y:0}};
 window.addEventListener("keydown",e=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","KeyW","KeyA","KeyS","KeyD"].includes(e.code))e.preventDefault();keys.add(e.code);});
 window.addEventListener("keyup",e=>keys.delete(e.code));
 window.addEventListener("blur",()=>keys.clear());
 for(const el of document.querySelectorAll(".joystick")){
  const name=el.dataset.joystick,knob=el.querySelector(".stick");let pid=null;
  const position=(e)=>{
   const r=el.getBoundingClientRect(),dx=(e.clientX-(r.left+r.width/2))/(r.width*.35),dy=(e.clientY-(r.top+r.height/2))/(r.height*.35),l=Math.max(1,Math.hypot(dx,dy));
   stick[name].x=dx/l;stick[name].y=dy/l;knob.style.transform="translate("+Math.round(stick[name].x*24)+"px,"+Math.round(stick[name].y*24)+"px)";
  };
  el.addEventListener("pointerdown",e=>{e.preventDefault();pid=e.pointerId;el.setPointerCapture(pid);position(e);});
  el.addEventListener("pointermove",e=>{if(pid===e.pointerId)position(e);});
  const reset=e=>{if(pid===e.pointerId){pid=null;stick[name].x=0;stick[name].y=0;knob.style.transform="translate(0,0)";}};
  el.addEventListener("pointerup",reset);el.addEventListener("pointercancel",reset);el.addEventListener("lostpointercapture",reset);
 }
 $("#mobile-action").addEventListener("click",()=>showProject(current));
 let pointer=null;
 stage.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse"&&e.button!==0)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY};stage.setPointerCapture(e.pointerId);});
 stage.addEventListener("pointermove",e=>{if(!pointer||pointer.id!==e.pointerId||!modal.hidden)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;pointer.x=e.clientX;pointer.y=e.clientY;yaw-=dx*.0038;pitch=clamp(pitch-dy*.0035,-.95,.8);});
 stage.addEventListener("pointerup",()=>pointer=null);stage.addEventListener("pointercancel",()=>pointer=null);
 let prevAction=false,gamepadActive=false;const clock=new THREE.Clock();
 const fv=new THREE.Vector3(),delta=new THREE.Vector3(),temp=new THREE.Vector3();
 function renderLabels(){
  projects.forEach(p=>{
   const pos=p.anchor.clone().project(camera),visible=pos.z<1&&pos.z>-1&&Math.abs(pos.x)<1.15&&Math.abs(pos.y)<1.12;
   p.label.hidden=!visible;if(visible){p.label.style.left=((pos.x+1)*.5*innerWidth)+"px";p.label.style.top=((-pos.y+1)*.5*innerHeight)+"px";}
  });
 }
 function choose(){
  camera.getWorldDirection(fv);let best=0,bestScore=-Infinity;
  projects.forEach((p,i)=>{
   temp.set(p.x,2.45,p.z).sub(camera.position);const distance=temp.length(),alignment=temp.normalize().dot(fv),score=alignment*2.7-distance*.012;
   if(score>bestScore){bestScore=score;best=i;}
  });focusProject(best);
 }
 function update(){
  const dt=Math.min(clock.getDelta(),.05),t=performance.now()*.001;
  const gp=[...(navigator.getGamepads?.()||[])].find(p=>p?.connected&&p.mapping==="standard")||[...(navigator.getGamepads?.()||[])].find(Boolean);
  if(gp?.connected&&!gamepadActive){$("#experience-state").textContent="CONTROLLER CONNECTED";gamepadActive=true;}
  if(!gp?.connected&&gamepadActive){$("#experience-state").textContent="3D STUDIO · LIVE SCENE";gamepadActive=false;}
  const dead=v=>Math.abs(v)>.18?v:0;
  const moveX=clamp(Number(keys.has("KeyD")||keys.has("ArrowRight"))-Number(keys.has("KeyA")||keys.has("ArrowLeft"))+stick.move.x+dead(gp?.axes?.[0]||0),-1,1);
  const moveZ=clamp(Number(keys.has("KeyS")||keys.has("ArrowDown"))-Number(keys.has("KeyW")||keys.has("ArrowUp"))+stick.move.y+dead(gp?.axes?.[1]||0),-1,1);
  if(modal.hidden){
   yaw-=stick.look.x*dt*1.9+dead(gp?.axes?.[2]||0)*dt*2.4;
   pitch=clamp(pitch-stick.look.y*dt*1.7-dead(gp?.axes?.[3]||0)*dt*1.8,-.95,.8);
   camera.rotation.set(pitch,yaw,0);
   const speed=6.7*dt,mag=Math.max(1,Math.hypot(moveX,moveZ));
   camera.position.x+=((Math.cos(yaw)*moveX+Math.sin(yaw)*moveZ)/mag)*speed;
   camera.position.z+=((-Math.sin(yaw)*moveX+Math.cos(yaw)*moveZ)/mag)*speed;
   camera.position.x=clamp(camera.position.x,-17.8,17.8);camera.position.z=clamp(camera.position.z,-19.4,20);
   choose();
   const a=!!gp?.buttons?.[0]?.pressed;if(a&&!prevAction)showProject(current);prevAction=a;
  }else prevAction=!!gp?.buttons?.[0]?.pressed;
  centerpiece.rotation.y+=dt*.14;core.rotation.y+=dt*.17;globe.rotation.y+=dt*.05;gridGlobe.rotation.y+=dt*.05;
  projects.forEach((p,i)=>{p.planet.rotation.y+=dt*.4;p.planet.position.y=2.43+Math.sin(t*1.5+i)*.13;p.aura.material.opacity=.38+Math.sin(t*2+i)*.18;});
  renderLabels();renderer.render(scene,camera);
 }
 renderer.setAnimationLoop(update);
 window.addEventListener("resize",()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));});
 document.addEventListener("visibilitychange",()=>{if(document.hidden)keys.clear();});
}
