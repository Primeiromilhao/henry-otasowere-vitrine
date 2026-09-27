(function(){
const modal=document.querySelector("#playerModal"),playerWrap=document.querySelector("#playerWrap");
let currentVideo=null,attempt=0,loadTimer=null;
function cleanText(s){return String(s??"").replaceAll("VÃ­deos","V\u00eddeos").replaceAll("vÃ­deos","v\u00eddeos").replaceAll("TÃ­tulo","T\u00edtulo").replaceAll("catÃ¡logo","cat\u00e1logo").replaceAll("publicitÃ¡rio","publicit\u00e1rio").replaceAll("integraÃ§Ã£o","integra\u00e7\u00e3o").replaceAll("aplicaÃ§Ã£o","aplica\u00e7\u00e3o").replaceAll("�","");}
function repairPage(){
 document.querySelectorAll("body *").forEach(el=>{if(el.children.length===0&&el.tagName!=="SCRIPT"&&el.tagName!=="STYLE"){const t=el.textContent,n=cleanText(t);if(n!==t)el.textContent=n;}});
}
function closePlayer(){clearTimeout(loadTimer);modal.hidden=true;playerWrap.innerHTML="";document.body.classList.remove("player-open");currentVideo=null;attempt=0}
function source(id,host){return "https://"+host+"/embed/"+encodeURIComponent(id)+"?playsinline=1&rel=0&controls=1&modestbranding=1"}
function showPlayer(v,host){
 const id=v?.id;if(!id)return;
 const poster="https://i.ytimg.com/vi/"+encodeURIComponent(id)+"/hqdefault.jpg";
 playerWrap.innerHTML='<div class="player-loading" id="playerLoading"><img src="'+poster+'" alt="" loading="eager"><div class="player-loading-text">A carregar o v\u00eddeo...</div></div><iframe id="ytPlayerFrame" title="V\u00eddeo" loading="eager" src="'+source(id,host)+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
 const frame=document.querySelector("#ytPlayerFrame"),loading=document.querySelector("#playerLoading");
 frame.addEventListener("load",()=>{clearTimeout(loadTimer);loading?.remove();frame.style.visibility="visible"}, {once:true});
 loadTimer=setTimeout(()=>{if(frame&&frame.contentWindow){if(attempt<2){attempt++;showPlayer(v,attempt===1?"www.youtube.com":"www.youtube-nocookie.com")}else{loading?.remove();frame.style.visibility="visible";const m=document.createElement("div");m.className="player-error";m.textContent="Este v\u00eddeo n\u00e3o respondeu. O sistema tentou recuperar a reprodu\u00e7\u00e3o automaticamente.";playerWrap.appendChild(m)}}},9000);
}
function openVideo(v){if(!v)return;currentVideo=v;attempt=0;modal.hidden=false;document.body.classList.add("player-open");showPlayer(v,"www.youtube-nocookie.com")}
window.openVideo=openVideo;
document.querySelector("#closePlayer")?.addEventListener("click",closePlayer);
modal?.addEventListener("click",e=>{if(e.target===modal)closePlayer()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.hidden)closePlayer()});
const observer=new MutationObserver(()=>repairPage());
observer.observe(document.body,{subtree:true,childList:true,characterData:true});
repairPage();
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
})();
