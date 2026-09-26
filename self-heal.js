const modal=document.querySelector("#playerModal"),playerWrap=document.querySelector("#playerWrap");let currentVideo=null,loadTimer=null;
function netInfo(){const c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;return{online:navigator.onLine,effectiveType:c?.effectiveType||"unknown",downlink:c?.downlink||0,rtt:c?.rtt||0}}
async function checkLocalHealth(){try{const r=await fetch("videos.json?health="+Date.now(),{cache:"no-store"});return r.ok}catch(e){return false}}
function closePlayer(){clearTimeout(loadTimer);modal.hidden=true;playerWrap.innerHTML=""}
function openVideo(v){
 if(!v)return;currentVideo=v;modal.hidden=false;clearTimeout(loadTimer);
 if(v.platform==="facebook"){
  const src="https://www.facebook.com/plugins/video.php?href="+encodeURIComponent(v.url)+"&show_text=false&width=560";
  playerWrap.innerHTML='<iframe id="fbPlayerFrame" title="Vídeo Facebook" loading="eager" src="'+src+'" style="border:none;overflow:hidden;width:100%;aspect-ratio:16/9" scrolling="no" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe>';
  return;
 }
 const id=encodeURIComponent(v.id),poster=v.thumbnail||("https://i.ytimg.com/vi/"+id+"/hqdefault.jpg");
 playerWrap.innerHTML='<div class="player-loading" id="playerLoading"><img src="'+poster+'" alt="" loading="eager"><div class="player-loading-text">A carregar o vídeo…</div></div><iframe id="ytPlayerFrame" title="Vídeo YouTube" loading="eager" src="https://www.youtube-nocookie.com/embed/'+id+'?playsinline=1&rel=0&controls=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
 const frame=document.querySelector("#ytPlayerFrame"),loading=document.querySelector("#playerLoading");frame.addEventListener("load",()=>{clearTimeout(loadTimer);loading?.remove()},{once:true});loadTimer=setTimeout(()=>loading?.remove(),10000)
}
async function runHealth(){try{await checkLocalHealth()}catch(e){}}
document.querySelector("#closePlayer").onclick=closePlayer;modal.addEventListener("click",e=>{if(e.target===modal)closePlayer()});window.addEventListener("online",runHealth);window.addEventListener("offline",runHealth);if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(console.warn);