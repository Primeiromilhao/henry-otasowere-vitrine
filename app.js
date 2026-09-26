const state={platform:"youtube",query:"",category:"Todos",videos:[],favorites:new Set()};
const grid=document.querySelector("#grid"),search=document.querySelector("#search"),sort=document.querySelector("#sort"),status=document.querySelector("#status");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const platforms={youtube:{label:"YOUTUBE",title:"Vídeos de Henry Otasowere"},facebook:{label:"FACEBOOK",title:"Vídeos de Henry Otasowere"},tiktok:{label:"TIKTOK",title:"Vídeos de Henry Otasowere"},instagram:{label:"INSTAGRAM",title:"Vídeos de Henry Otasowere"}};
function renderHeader(){document.querySelector("#platformEyebrow").textContent=platforms[state.platform].label;document.querySelector("#platformTitle").textContent=platforms[state.platform].title}
function renderEmptyPlatform(){grid.innerHTML='<div class="platform-empty"><span class="icon">'+({facebook:"f",tiktok:"♪",instagram:"◎"}[state.platform]||"")+'</span><h3>Conteúdo desta plataforma em breve</h3><p>A plataforma já está preparada no aplicativo. Os vídeos aparecerão aqui quando o catálogo correspondente for integrado.</p></div>';status.textContent="Plataforma preparada"}
function render(){
 renderHeader();
 if(state.platform!=="youtube"){document.querySelector("#categories").innerHTML="";renderEmptyPlatform();return}
 let items=state.videos.filter(v=>(v.title+" "+(v.category||"")).toLowerCase().includes(state.query.toLowerCase()));
 if(state.category!=="Todos")items=items.filter(v=>(v.category||"").toLowerCase()===state.category.toLowerCase());
 if(sort.value==="title")items.sort((a,b)=>a.title.localeCompare(b.title));
 else items.sort((a,b)=>(b.upload_date||"").localeCompare(a.upload_date||""));
 grid.innerHTML=items.map(v=>{const thumb=v.thumbnail||"https://i.ytimg.com/vi/"+v.id+"/hqdefault.jpg";
 return '<article class="card"><button class="thumb-button" data-id="'+esc(v.id)+'"><div class="thumb" style="background-image:url(\''+thumb+'\')"><span class="badge">YouTube</span><span class="play-overlay">▶</span></div></button><div class="card-body"><h3>'+esc(v.title)+'</h3><div class="meta">'+esc(v.channel||"Voz da Cura Network")+" · "+esc(v.category||"Pregação")+'</div><button class="watch" data-id="'+esc(v.id)+'">▶ Assistir</button></div></article>'}).join("");
 status.textContent=items.length+" vídeo(s) no catálogo";
 grid.querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>openVideo(state.videos.find(v=>v.id===b.dataset.id)));
}
function categories(){
 if(state.platform!=="youtube"){document.querySelector("#categories").innerHTML="";return}
 const cats=["Todos",...new Set(state.videos.map(v=>v.category).filter(Boolean))];
 document.querySelector("#categories").innerHTML=cats.map(c=>'<button class="chip '+(c===state.category?"active":"")+'" data-cat="'+esc(c)+'">'+esc(c)+"</button>").join("");
 document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;categories();render()});
}
async function load(){
 status.textContent="A carregar catálogo…";
 try{const r=await fetch("videos.json?v=4",{cache:"no-store"});if(!r.ok)throw new Error("Catálogo indisponível");state.videos=await r.json();if(!Array.isArray(state.videos)||!state.videos.length)throw new Error("Catálogo vazio");
 document.querySelector("#count-youtube").textContent=state.videos.length+" vídeos";categories();render();
 }catch(e){state.videos=[];document.querySelector("#count-youtube").textContent="—";grid.innerHTML='<div class="empty">Não foi possível carregar o catálogo. O sistema automático tentará recuperar.</div>';status.textContent="Catálogo indisponível";console.error(e)}
}
function setPlatform(platform){state.platform=platform;state.category="Todos";document.querySelectorAll(".platform").forEach(b=>b.classList.toggle("active",b.dataset.platform===platform));categories();render();window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll(".platform").forEach(b=>b.onclick=()=>setPlatform(b.dataset.platform));
search.oninput=()=>{state.query=search.value;render()};sort.onchange=render;
document.querySelectorAll(".bottom-item").forEach(b=>b.onclick=()=>{document.querySelectorAll(".bottom-item").forEach(x=>x.classList.remove("active"));b.classList.add("active");const action=b.dataset.bottom;if(action==="search"){search.focus();document.querySelector("#searchArea").scrollIntoView({behavior:"smooth",block:"center"})}else if(action==="home"){window.scrollTo({top:0,behavior:"smooth"})}else if(action==="favorites"){status.textContent="Favoritos: selecione esta função quando a área de favoritos for ativada."}else if(action==="more"){document.querySelector("footer")?.scrollIntoView({behavior:"smooth"})}});
load();
