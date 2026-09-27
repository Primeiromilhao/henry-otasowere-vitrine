(()=>{
let deferredPrompt=null;
const btn=()=>document.querySelector("#installApp");
function setReady(){const b=btn();if(!b)return;b.hidden=false;b.textContent="📲 Instalar app";}
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;setReady();});
window.addEventListener("appinstalled",()=>{deferredPrompt=null;const b=btn();if(b){b.hidden=true;}});
function isIOS(){return /iphone|ipad|ipod/i.test(navigator.userAgent)&&!window.MSStream;}
function isStandalone(){return window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;}
async function install(){
 if(isStandalone())return;
 if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;return;}
 if(isIOS()){alert("No iPhone/iPad: toque em Partilhar e depois em “Adicionar ao ecrã principal”.");return;}
 alert("Para instalar, abra o menu do navegador e escolha “Instalar aplicação” ou “Adicionar ao ecrã principal”.");
}
document.addEventListener("click",e=>{if(e.target.closest("#installApp"))install();});
window.addEventListener("load",()=>{if(!isStandalone()&&(deferredPrompt||isIOS()))setReady();});
})();
