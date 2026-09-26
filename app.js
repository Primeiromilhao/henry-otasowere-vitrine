const state={platform:"youtube",query:"",category:"Todos",videos:[]};
const grid=document.querySelector("#grid"),search=document.querySelector("#search"),sort=document.querySelector("#sort");
const status=document.querySelector("#status");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
function videoUrl(v){return v.url||("https://www.youtube.com/watch?v="+v.id)}
function render(){
 let items=state.videos.filter(v=>(v.title+" "+(v.category||"")).toLowerCase().includes(state.query.toLowerCase()));
 if(state.category!=="Todos")items=items.filter(v=>(v.category||"").toLowerCase()===state.category.toLowerCase());
 if(sort.value==="title")items.sort((a,b)=>a.title.localeCompare(b.title));
 if(sort.value==="recent")items.sort((a,b)=>(b.upload_date||"").localeCompare(a.upload_date||""));
 grid.innerHTML=items.map(v=>{const thumb=v.thumbnail||"https://i.ytimg.com/vi/"+v.id+"/hqdefault.jpg",url=videoUrl(v);
 return '<article class="card"><button class="thumb-button" data-id="'+esc(v.id)+'"><div class="thumb" style="background-image:url(\''+thumb+'\')"><span class="badge">YouTube</span><span class="play-overlay">▶</span></div></button><div class="card-body"><h3>'+esc(v.title)+'</h3><div class="meta">'+esc(v.channel||"Voz da Cura Network")+" · "+esc(v.category||"Pregação")+'</div><button class="watch" data-id="'+esc(v.id)+'">▶ Assistir</button><a href="'+url+'" target="_blank" rel="noopener noreferrer">Abrir no YouTube</a></div></article>'}).join("");
 status.textContent=items.length+" vídeo(s) no catálogo";
 document.querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>openVideo(state.videos.find(v=>v.id===b.dataset.id)));
}
function categories(){
 const cats=["Todos",...new Set(state.videos.map(v=>v.category).filter(Boolean))];
 document.querySelector("#categories").innerHTML=cats.map(c=>'<button class="chip '+(c===state.category?"active":"")+'" data-cat="'+esc(c)+'">'+esc(c)+"</button>").join("");
 document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;categories();render()});
}
async function load(){
 status.textContent="A carregar catálogo…";
 try{
  const r=await fetch("videos.json?v=3",{cache:"no-store"});if(!r.ok)throw new Error("Catálogo indisponível");
  state.videos=await r.json();if(!Array.isArray(state.videos)||!state.videos.length)throw new Error("Catálogo vazio");
  document.querySelector("#count-youtube").textContent=state.videos.length+" vídeos";categories();render();
 }catch(e){state.videos=[];document.querySelector("#count-youtube").textContent="—";grid.innerHTML='<div class="empty">Não foi possível carregar o catálogo. O sistema automático tentará recuperar.</div>';status.textContent="Catálogo indisponível";console.error(e)}
}
search.oninput=()=>{state.query=search.value;render()};sort.onchange=render;
load();