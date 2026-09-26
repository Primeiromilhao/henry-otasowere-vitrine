const state={platform:"youtube",query:"",category:"Todos",videos:[],favorites:new Set()};
const grid=document.querySelector("#grid"),search=document.querySelector("#search"),sort=document.querySelector("#sort"),status=document.querySelector("#status");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const platforms={youtube:{label:"YOUTUBE",title:"VÃ­deos de Henry Otasowere"},facebook:{label:"FACEBOOK",title:"VÃ­deos do MinistÃ©rio Voz Da Cura"},tiktok:{label:"TIKTOK",title:"VÃ­deos de Henry Otasowere"},instagram:{label:"INSTAGRAM",title:"VÃ­deos de Henry Otasowere"}};
function renderHeader(){document.querySelector("#platformEyebrow").textContent=platforms[state.platform].label;document.querySelector("#platformTitle").textContent=platforms[state.platform].title}
function renderEmptyPlatform(){grid.innerHTML='<div class="platform-empty"><span class="icon">'+({tiktok:"â™ª",instagram:"â—Ž"}[state.platform]||"")+'</span><h3>ConteÃºdo desta plataforma em breve</h3><p>A plataforma jÃ¡ estÃ¡ preparada no aplicativo. Os vÃ­deos aparecerÃ£o aqui quando o catÃ¡logo correspondente for integrado.</p></div>';status.textContent="Plataforma preparada"}
function render(){
 renderHeader();
 let items=state.videos.filter(v=>v.platform===state.platform&&((v.title+" "+(v.category||"")).toLowerCase().includes(state.query.toLowerCase())));
 if(state.category!=="Todos")items=items.filter(v=>(v.category||"").toLowerCase()===state.category.toLowerCase());
 if(sort.value==="title")items.sort((a,b)=>a.title.localeCompare(b.title));else items.sort((a,b)=>(b.upload_date||"").localeCompare(a.upload_date||""));
 if(!items.length&&["tiktok","instagram"].includes(state.platform)){renderEmptyPlatform();return}
 grid.innerHTML=items.map(v=>{const thumb=v.thumbnail||"";const badge=v.platform==="facebook"?"Facebook":v.platform==="tiktok"?"TikTok":"YouTube";return '<article class="card"><button class="thumb-button" data-id="'+esc(v.id)+'"><div class="thumb" style="background-image:url(\''+esc(thumb)+'\')"><span class="badge">'+badge+'</span><span class="play-overlay">â–¶</span></div></button><div class="card-body"><h3>'+esc(v.title)+'</h3><div class="meta">'+esc(v.channel||"Voz da Cura Network")+" Â· "+esc(v.category||"PregaÃ§Ã£o")+'</div><button class="watch" data-id="'+esc(v.id)+'">â–¶ Assistir</button></div></article>'}).join("");
 status.textContent=items.length+" vÃ­deo(s) no catÃ¡logo";
 grid.querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>openVideo(state.videos.find(v=>v.id===b.dataset.id)));
}
function categories(){
 const items=state.videos.filter(v=>v.platform===state.platform);
 if(!items.length){document.querySelector("#categories").innerHTML="";return}
 const cats=["Todos",...new Set(items.map(v=>v.category).filter(Boolean))];
 document.querySelector("#categories").innerHTML=cats.map(c=>'<button class="chip '+(c===state.category?"active":"")+'" data-cat="'+esc(c)+'">'+esc(c)+"</button>").join("");
 document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;categories();render()});
}
async function load(){
 status.textContent="A carregar catÃ¡logoâ€¦";
 try{
  const [yr,fr,tr]=await Promise.all([fetch("videos.json?v=5",{cache:"no-store"}),fetch("videos-facebook.json?v=2",{cache:"no-store"}),fetch("videos-tiktok.json?v=1",{cache:"no-store"})]);
  if(!yr.ok||!fr.ok||!tr.ok)throw new Error("CatÃ¡logo indisponÃ­vel");
  const y=await yr.json(),f=await fr.json(),t=await tr.json();state.videos=[...y,...f,...t];
  document.querySelector("#count-youtube").textContent=y.length+" vÃ­deos";
  const fb=document.querySelector("#count-facebook");if(fb)fb.textContent=f.length+" vÃ­deos";const tk=document.querySelector("#count-tiktok");if(tk)tk.textContent=t.length+" vÃ­deos";
  categories();render();
 }catch(e){state.videos=[];document.querySelector("#count-youtube").textContent="â€”";document.querySelector("#count-facebook")&&(document.querySelector("#count-facebook").textContent="â€”");grid.innerHTML='<div class="empty">NÃ£o foi possÃ­vel carregar o catÃ¡logo. O sistema automÃ¡tico tentarÃ¡ recuperar.</div>';status.textContent="CatÃ¡logo indisponÃ­vel";console.error(e)}
}
function setPlatform(platform){state.platform=platform;state.category="Todos";document.querySelectorAll(".platform").forEach(b=>b.classList.toggle("active",b.dataset.platform===platform));categories();render();window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll(".platform").forEach(b=>b.onclick=()=>setPlatform(b.dataset.platform));
search.oninput=()=>{state.query=search.value;render()};sort.onchange=render;
document.querySelectorAll(".bottom-item").forEach(b=>b.onclick=()=>{document.querySelectorAll(".bottom-item").forEach(x=>x.classList.remove("active"));b.classList.add("active");const action=b.dataset.bottom;if(action==="search"){search.focus();document.querySelector("#searchArea").scrollIntoView({behavior:"smooth",block:"center"})}else if(action==="home"){window.scrollTo({top:0,behavior:"smooth"})}else if(action==="favorites"){status.textContent="Favoritos: selecione esta funÃ§Ã£o quando a Ã¡rea de favoritos for ativada."}else if(action==="more"){document.querySelector("footer")?.scrollIntoView({behavior:"smooth"})}});
load();\n
