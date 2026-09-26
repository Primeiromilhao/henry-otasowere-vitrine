const modal=document.querySelector("#playerModal"),playerWrap=document.querySelector("#playerWrap");
const repairBox=document.querySelector("#repairBox"),externalVideo=document.querySelector("#externalVideo");
const healthPanel=document.querySelector("#healthPanel"),healthText=document.querySelector("#healthText");
let ytPlayer=null,currentVideo=null,retries=0,bufferTimer=null;
function setRepair(msg,kind=""){repairBox.textContent=msg;repairBox.className="repair-box "+kind}
function netInfo(){
 const c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
 return {online:navigator.onLine,effectiveType:c?.effectiveType||"unknown",downlink:c?.downlink||0,rtt:c?.rtt||0};
}
function classifyNetwork(){
 const n=netInfo();
 if(!n.online)return "offline";
 if(n.effectiveType==="2g"||n.effectiveType==="slow-2g"||n.downlink<1||n.rtt>1000)return "slow";
 return "ok";
}
async function checkLocalHealth(){
 const t=performance.now();
 try{const r=await fetch("videos.json?health="+Date.now(),{cache:"no-store"});return {ok:r.ok,rtt:Math.round(performance.now()-t)}}
 catch(e){return {ok:false,rtt:Math.round(performance.now()-t)}}
}
function closePlayer(){if(ytPlayer?.destroy)try{ytPlayer.destroy()}catch{};ytPlayer=null;clearTimeout(bufferTimer);modal.hidden=true;playerWrap.innerHTML=""}
function openVideo(v){
 if(!v)return;
 currentVideo=v;retries=0;modal.hidden=false;
 document.querySelector("#playerTitle").textContent=v.title||"Reprodução";
 const url=v.url||("https://www.youtube.com/watch?v="+v.id);
 externalVideo.href=url;
 setRepair("A carregar o vídeo…","warn");
 if(v.platform==="youtube"||v.id){
   const id=encodeURIComponent(v.id);
   playerWrap.innerHTML='<iframe id="ytPlayerFrame" title="Vídeo YouTube" src="https://www.youtube.com/embed/'+id+'?playsinline=1&rel=0&enablejsapi=1&origin='+encodeURIComponent(location.origin)+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
   // O iframe direto já pode reproduzir mesmo que a API do YouTube demore ou falhe.
   loadYouTube().then(()=>createYT(v)).catch(()=>setRepair("Vídeo carregado. O modo de reprodução direta está ativo.","ok"));
 }else fallback("Esta fonte será aberta diretamente na plataforma.");
}
function fallback(msg){
 setRepair(msg,"warn");
 playerWrap.innerHTML='<div class="fallback">A fonte original continua disponível no botão abaixo.</div>';
}
function loadYouTube(){
 if(window.YT?.Player)return Promise.resolve();
 return new Promise((resolve,reject)=>{
  const old=window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady=()=>{old?.();resolve()};
  const s=document.createElement("script");s.src="https://www.youtube.com/iframe_api";s.async=true;
  s.onerror=reject;document.head.appendChild(s);
  setTimeout(()=>window.YT?.Player?resolve():reject(new Error("YouTube API timeout")),8000);
 });
}
function createYT(v){
 const n=classifyNetwork();
 if(n==="offline"){setRepair("Sem internet. Aguarde a ligação e tente novamente.","warn");return}
 if(n==="slow")setRepair("Ligação lenta detectada. O sistema vai priorizar uma reprodução leve.","warn");
 try{
  ytPlayer=new YT.Player("ytPlayerFrame",{
   events:{onReady:onYTReady,onStateChange:onYTState,onError:onYTError,
   onAutoplayBlocked:()=>setRepair("Toque em Reproduzir no próprio vídeo.","warn")}
  });
 }catch(e){
  ytPlayer=null;
  setRepair("Vídeo carregado. Reprodução direta ativa.","ok");
 }
}
function onYTReady(e){
 setRepair("Fonte disponível. Reprodução protegida contra falhas.","ok");
 if(classifyNetwork()==="slow")try{e.target.setPlaybackQuality("small")}catch{}
}
function onYTState(e){
 if(e.data===1){clearTimeout(bufferTimer);setRepair("Reprodução normal.","ok")}
 if(e.data===3){clearTimeout(bufferTimer);bufferTimer=setTimeout(()=>{if(ytPlayer?.getPlayerState?.()===3)repairPlayback()},9000)}
}
async function repairPlayback(){
 const n=classifyNetwork();
 if(n==="offline"){setRepair("A ligação caiu. Aguardando a internet voltar…","warn");return}
 if(retries<2&&ytPlayer){
  retries++;setRepair("Travamento detectado. Tentativa automática "+retries+"/2…","warn");
  try{ytPlayer.pauseVideo();if(n==="slow")ytPlayer.setPlaybackQuality("small");ytPlayer.playVideo()}catch{}
  return;
 }
 fallback("O vídeo não respondeu após as tentativas automáticas. Pode ser limitação da fonte, bloqueio de incorporação ou indisponibilidade do vídeo.");
}
function onYTError(e){
 const code=e.data;
 if(code===100){setRepair("O YouTube informou que o vídeo não está disponível ou é privado.","error");fallback("Vídeo indisponível no YouTube.");return}
 if(code===101||code===150){setRepair("O proprietário não permite reprodução incorporada. O sistema mudou para a fonte original.","warn");fallback("A incorporação foi bloqueada pela fonte.");return}
 if(code===153){setRepair("A fonte recusou a identificação da incorporação. O sistema vai abrir o YouTube diretamente.","warn");fallback("Identificação da incorporação recusada.");return}
 if(code===2){setRepair("ID de vídeo inválido. O sistema manteve o link original como alternativa.","error");fallback("Vídeo com identificação inválida.");return}
 repairPlayback();
}
async function runHealth(){
 healthPanel.hidden=false;healthText.textContent="A testar internet e catálogo…";
 const [local,n]=await Promise.all([checkLocalHealth(),Promise.resolve(netInfo())]);
 if(!n.online){healthText.textContent="Sem internet — o catálogo local continua disponível e a reprodução será retomada quando voltar.";return}
 healthText.textContent=local.ok?"Ligação normal · RTT "+local.rtt+" ms · "+(n.effectiveType||"rede")+" · reparação automática ativa":"Servidor do catálogo sem resposta — nova tentativa automática disponível.";
}
document.querySelector("#closePlayer").onclick=closePlayer;
document.querySelector("#retryVideo").onclick=()=>currentVideo&&openVideo(currentVideo);
document.querySelector("#healthButton").onclick=runHealth;
modal.addEventListener("click",e=>{if(e.target===modal)closePlayer()});
window.addEventListener("online",runHealth);
window.addEventListener("offline",runHealth);
runHealth();
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(console.warn);