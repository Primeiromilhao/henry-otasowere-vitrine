const state={platform:"youtube",query:"",category:"Todos",videos:[],favorites:new Set()};
const grid=document.querySelector("#grid"),search=document.querySelector("#search"),sort=document.querySelector("#sort"),status=document.querySelector("#status");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function repairText(value){
 let s=String(value??"");
 const map={"VÃ­deos":"V\u00eddeos","vÃ­deos":"v\u00eddeos","TÃ­tulo":"T\u00edtulo","catÃ¡logo":"cat\u00e1logo","CatÃ¡logo":"Cat\u00e1logo","publicitÃ¡rio":"publicit\u00e1rio","PUBLICITÃ\u0081RIO":"PUBLICIT\u00c1RIO","integraÃ§Ã£o":"integra\u00e7\u00e3o","IntegraÃ§Ã£o":"Integra\u00e7\u00e3o","aplicaÃ§Ã£o":"aplica\u00e7\u00e3o","NÃ£o":"N\u00e3o","nÃ£o":"n\u00e3o","vocÃª":"voc\u00ea","Voz da Cura Â·":"Voz da Cura \u00b7","â€”":"\u2014","â€“":"\u2013","â€¦":"\u2026","âœ“":"\u2713","â™¡":"\u2661","â˜°":"\u2630","âŒ‚":"\u2302","âŒ•":"\u2315","â–¶":"\u25b6","�":" "};
 for(const [a,b] of Object.entries(map))s=s.split(a).join(b);
 return s;
}
const platforms={youtube:{label:"YOUTUBE",title:"V\u00eddeos de Henry Otasowere"},facebook:{label:"FACEBOOK",title:"V\u00eddeos do Minist\u00e9rio Voz da Cura"},tiktok:{label:"TIKTOK",title:"V\u00eddeos de Henry Otasowere"},instagram:{label:"INSTAGRAM",title:"V\u00eddeos de Henry Otasowere"}};
function renderHeader(){document.querySelector("#platformEyebrow").textContent=platforms[state.platform].label;document.querySelector("#platformTitle").textContent=platforms[state.platform].title}
function renderEmptyPlatform(){grid.innerHTML='<div class="platform-empty"><span class="icon">'+({tiktok:"\u266a",instagram:"\u25c9"}[state.platform]||"")+'</span><h3>Conte\u00fado desta plataforma em breve</h3><p>A plataforma j\u00e1 est\u00e1 preparada no aplicativo. Os v\u00eddeos aparecer\u00e3o aqui quando o cat\u00e1logo correspondente for integrado.</p></div>';status.textContent="Plataforma preparada"}
function render(){
 renderHeader();
 let items=state.videos.filter(v=>v.platform===state.platform&&((repairText(v.title)+" "+repairText(v.category||"")).toLowerCase().includes(state.query.toLowerCase())));
 if(state.category!=="Todos")items=items.filter(v=>repairText(v.category||"").toLowerCase()===state.category.toLowerCase());
 if(sort.value==="title")items.sort((a,b)=>repairText(a.title).localeCompare(repairText(b.title)));else items.sort((a,b)=>(b.upload_date||"").localeCompare(a.upload_date||""));
 if(!items.length&&["tiktok","instagram"].includes(state.platform)){renderEmptyPlatform();return}
 grid.innerHTML=items.map(v=>{const thumb=v.thumbnail||"";const badge=v.platform==="facebook"?"Facebook":v.platform==="tiktok"?"TikTok":"YouTube";return '<article class="card"><button class="thumb-button" data-id="'+esc(v.id)+'"><div class="thumb" style="background-image:url(\''+esc(thumb)+'\')"><span class="badge">'+badge+'</span><span class="play-overlay">&#9654;</span></div></button><div class="card-body"><h3>'+esc(repairText(v.title))+'</h3><div class="meta">'+esc(repairText(v.channel||"Voz da Cura Network"))+" - "+esc(repairText(v.category||"Pregacao"))+'</div><button class="watch" data-id="'+esc(v.id)+'">&#9654; Assistir</button></div></article>'}).join("");
 status.textContent=items.length+" v\u00eddeos no cat\u00e1logo";
 grid.querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>openVideo(state.videos.find(v=>v.id===b.dataset.id)));
}
function categories(){
 const items=state.videos.filter(v=>v.platform===state.platform);
 if(!items.length){document.querySelector("#categories").innerHTML="";return}
 const cats=["Todos",...new Set(items.map(v=>repairText(v.category)).filter(Boolean))];
 document.querySelector("#categories").innerHTML=cats.map(c=>'<button class="chip '+(c===state.category?"active":"")+'" data-cat="'+esc(c)+'">'+esc(c)+"</button>").join("");
 document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;categories();render()});
}
async function load(){
 status.textContent="A carregar cat\u00e1logo...";
 try{
  const [yr,fr,tr]=await Promise.all([fetch("videos.json?v=6",{cache:"no-store"}),fetch("videos-facebook.json?v=3",{cache:"no-store"}),fetch("videos-tiktok.json?v=2",{cache:"no-store"})]);
  if(!yr.ok||!fr.ok||!tr.ok)throw new Error("Catalogos indisponiveis");
  const y=await yr.json(),f=await fr.json(),t=await tr.json();state.videos=[...y,...f,...t];
  document.querySelector("#count-youtube").textContent=y.length+" v\u00eddeos";const fb=document.querySelector("#count-facebook");if(fb)fb.textContent=f.length+" v\u00eddeos";const tk=document.querySelector("#count-tiktok");if(tk)tk.textContent=t.length+" v\u00eddeos";
  categories();render();
 }catch(e){state.videos=[];document.querySelector("#count-youtube").textContent="-";document.querySelector("#count-facebook")&&(document.querySelector("#count-facebook").textContent="-");grid.innerHTML='<div class="empty">N\u00e3o foi poss\u00edvel carregar o cat\u00e1logo. O sistema tentar\u00e1 recuperar automaticamente.</div>';status.textContent="Cat\u00e1logo indispon\u00edvel";console.error(e)}
}
function setPlatform(platform){state.platform=platform;state.category="Todos";document.querySelectorAll(".platform").forEach(b=>b.classList.toggle("active",b.dataset.platform===platform));categories();render();window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll(".platform").forEach(b=>b.onclick=()=>setPlatform(b.dataset.platform));
search.oninput=()=>{state.query=search.value;render()};sort.onchange=render;
document.querySelectorAll(".bottom-item").forEach(b=>b.onclick=()=>{document.querySelectorAll(".bottom-item").forEach(x=>x.classList.remove("active"));b.classList.add("active");const action=b.dataset.bottom;if(action==="search"){search.focus();document.querySelector("#searchArea").scrollIntoView({behavior:"smooth",block:"center"})}else if(action==="home"){window.scrollTo({top:0,behavior:"smooth"})}else if(action==="favorites"){status.textContent="Favoritos: selecione esta funcao quando a area de favoritos for ativada."}else if(action==="more"){document.querySelector("footer")?.scrollIntoView({behavior:"smooth"})}});
load();
