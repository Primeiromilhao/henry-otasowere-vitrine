const state={platform:"youtube",query:"",category:"Todos",videos:[]};
const grid=document.querySelector("#grid"),search=document.querySelector("#search"),sort=document.querySelector("#sort");
const status=document.querySelector("#status");

function render(){
 let items=state.videos.filter(v=>(v.title+" "+(v.category||"")).toLowerCase().includes(state.query.toLowerCase()));
 if(state.category!=="Todos")items=items.filter(v=>(v.category||"").toLowerCase()===state.category.toLowerCase());
 if(sort.value==="title")items.sort((a,b)=>a.title.localeCompare(b.title));
 if(sort.value==="recent")items.sort((a,b)=>(b.upload_date||"").localeCompare(a.upload_date||""));
 grid.innerHTML=items.map(v=>{const thumb=v.thumbnail||"https://i.ytimg.com/vi/"+v.id+"/hqdefault.jpg";const url=v.url||("https://www.youtube.com/watch?v="+v.id);return '<article class="card"><a class="thumb-link" href="'+url+'" target="_blank" rel="noopener noreferrer"><div class="thumb" style="background-image:url(\''+thumb+'\')"><span class="badge">YouTube</span>'+(v.duration?'<span class="duration">'+v.duration+"</span>":"")+'<span class="play-overlay">▶</span></div></a><div class="card-body"><h3>'+v.title+'</h3><div class="meta">'+(v.channel||"Voz da Cura Network")+' · '+(v.category||"Pregação")+'</div><a href="'+url+'" target="_blank" rel="noopener noreferrer">▶ Assistir no YouTube</a></div></article>';}).join("");
 status.textContent=items.length+" vídeo(s) no catálogo";
}
function categories(){
 const cats=["Todos",...new Set(state.videos.map(v=>v.category).filter(Boolean))];
 document.querySelector("#categories").innerHTML=cats.map(c=>'<button class="chip '+(c===state.category?"active":"")+'" data-cat="'+c+'">'+c+"</button>").join("");
 document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;categories();render()});
}
async function load(){
 status.textContent="A carregar catálogo…";
 try{
  const r=await fetch("videos.json?v=2",{cache:"no-store"});
  if(!r.ok)throw new Error("Catálogo indisponível");
  state.videos=await r.json();
  if(!Array.isArray(state.videos)||!state.videos.length)throw new Error("Catálogo vazio");
  document.querySelector("#count-youtube").textContent=state.videos.length+" vídeos";
  categories();render();
 }catch(e){
  state.videos=[];
  document.querySelector("#count-youtube").textContent="—";
  grid.innerHTML='<div class="empty">Não foi possível carregar o catálogo. Recarregue a página.</div>';
  status.textContent="Catálogo indisponível";
  console.error(e);
 }
}
search.oninput=()=>{state.query=search.value;render()};sort.onchange=render;
document.querySelectorAll(".platform").forEach(b=>b.onclick=()=>{if(b.dataset.platform!=="youtube"){alert("Esta aba ficará ativa quando ligarmos a fonte "+b.textContent.trim()+".");return}document.querySelectorAll(".platform").forEach(x=>x.classList.remove("active"));b.classList.add("active")});
document.querySelector("#heroPlay").onclick=()=>document.querySelector("#grid").scrollIntoView({behavior:"smooth"});
load();
