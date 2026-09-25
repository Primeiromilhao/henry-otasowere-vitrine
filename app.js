const state={platform:"youtube",query:"",category:"Todos",videos:[]};
const grid=document.querySelector("#grid"),search=document.querySelector("#search"),sort=document.querySelector("#sort");
const status=document.querySelector("#status");
const sample=[
["Como Quebrar Maldições Familiares","Maldições Familiares","https://www.youtube.com/results?search_query=Henry+Otasowere+Generational+Curses"],
["O Poder do Altar","Altar","https://www.youtube.com/results?search_query=Henry+Otasowere+Altar"],
["Libertação e Padrões Geracionais","Libertação","https://www.youtube.com/results?search_query=Henry+Otasowere+Deliverance"],
["Oração e Poder","Oração","https://www.youtube.com/results?search_query=Henry+Otasowere+Prayer"],
["Ensino sobre Família","Família","https://www.youtube.com/results?search_query=Henry+Otasowere+Family"],
["Pregação e Fé","Fé","https://www.youtube.com/results?search_query=Henry+Otasowere+Faith"]
].map(v=>({title:v[0],category:v[1],url:v[2],thumb:"",duration:""}));
function render(){
 let items=state.videos.filter(v=>(v.title+" "+(v.category||"")).toLowerCase().includes(state.query.toLowerCase()));
 if(state.category!=="Todos")items=items.filter(v=>(v.category||"").toLowerCase()===state.category.toLowerCase());
 if(sort.value==="title")items.sort((a,b)=>a.title.localeCompare(b.title));
 if(sort.value==="recent")items.sort((a,b)=>(b.upload_date||"").localeCompare(a.upload_date||""));
 grid.innerHTML=items.map(v=>'<article class="card"><div class="thumb" style="background-image:url(\''+(v.thumbnail||v.thumb||"assets/youtube-placeholder.jpg")+'\')"><span class="badge">YouTube</span>'+(v.duration?'<span class="duration">'+v.duration+"</span>":"")+'</div><div class="card-body"><h3>'+v.title+'</h3><div class="meta">Voz da Cura Network · '+(v.category||"Pregação")+'</div><a href="'+v.url+'" target="_blank" rel="noopener">▶ Assistir no YouTube</a></div></article>').join("");
 status.textContent=items.length+" vídeo(s) no catálogo";
}
function categories(){
 const cats=["Todos",...new Set(state.videos.map(v=>v.category).filter(Boolean))];
 document.querySelector("#categories").innerHTML=cats.map(c=>'<button class="chip '+(c===state.category?"active":"")+'" data-cat="'+c+'">'+c+"</button>").join("");
 document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;categories();render()});
}
async function load(){
 try{const r=await fetch("videos.json",{cache:"no-store"});if(r.ok)state.videos=await r.json();else state.videos=sample}catch(e){state.videos=sample}
 document.querySelector("#count-youtube").textContent=state.videos.length+" vídeos";
 categories();render();
}
search.oninput=()=>{state.query=search.value;render()};sort.onchange=render;
document.querySelectorAll(".platform").forEach(b=>b.onclick=()=>{if(b.dataset.platform!=="youtube"){alert("Esta aba ficará ativa quando ligarmos a fonte "+b.textContent.trim()+".");return}document.querySelectorAll(".platform").forEach(x=>x.classList.remove("active"));b.classList.add("active")});
document.querySelector("#heroPlay").onclick=()=>document.querySelector("#grid").scrollIntoView({behavior:"smooth"});
load();
