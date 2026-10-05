(function(){
  const BOOKS_URL="https://raw.githubusercontent.com/Primeiromilhao/blogger_Estudos/main/books_categorized.json";
  let books=[];

  const segmentKeywords={
    "Altar":["altar","satan"],
    "Oração":["oração","oracao","prayer"],
    "Família e Relacionamentos":["casamento","família","familia","relacionamento","amor","mulher","marry","intimacy","sex"],
    "Maldições e Família":["curse","generational","maldição","maldicao","família","familia"],
    "Libertação":["deliverance","libert","spirits","altar"],
    "Cura e Milagres":["cura","milagre","milagres","sangue","dor","vitória","vitoria","testemunho","jesus"],
    "Fé":["fé","fe ","faith","medo","impossível","impossivel"],
    "Profético":["profético","profetico","profecia","destino","propósito","proposito"],
    "Bênçãos":["bênção","bencao","abundância","abundancia","prosperidade","prosper","blessing","sucesso","colheita"],
    "Ensino e Pregação":["ensino","pregação","pregacao","fé","fe","vida","caráter","carater","pensamento","oração","oracao"]
  };
  const categoryKeywords={
    "Batalha Espiritual & Libertação":["altar","satan","marine","spirits","curse","generational","deliverance","libert","maldição","maldicao"],
    "Relacionamentos & Família":["casamento","mulher","marry","amor","love","family","familia","intimacy","sex","pessoas difíceis","pessoas dificeis","dança comigo","danca comigo"],
    "Vida Espiritual & Mistérios":["oração","oracao","prayer","altar","anjos","anjo","fé","faith","salvação","salvacao","sangue","testemunho","jesus"],
    "Sucesso, Finanças & Mentalidade":["abundancia","abundância","prosper","prosperidade","dinheiro","finanças","financas","sucesso","pensamento","mindset","juros","conta bancária","conta bancaria","contribuição","contribuicao","foco","focus","airdrop","crypto"],
    "Acervo Obras Diversas":["dor","vitoria","vitória","medo","fracasso","aflição","aflicao","destino","problemas","caráter","carater","vida","atraso","continuar","poder","colheita","boca","pensamentos"]
  };
  const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const flat=()=>books.flatMap(c=>(c.books||[]).map(b=>({...b,bookCategory:c.category})));

  function score(book,title,segment){
    const t=norm(title), s=norm(segment), bt=norm(book.title), bc=norm(book.bookCategory);
    let n=0;
    const add=(keys,weight)=>keys.forEach(k=>{const q=norm(k);if(q&&(t+" "+s).includes(q))n+=weight});
    add(segmentKeywords[segment]||[],10);
    add(categoryKeywords[book.bookCategory]||[],7);
    bt.split(/\s+/).filter(x=>x.length>=5).forEach(x=>{if(t.includes(x))n+=6});
    if(s.includes("altar")&&bt.includes("altar"))n+=70;
    if(s.includes("oração")||s.includes("oracao"))if(/oração|oracao|prayer/.test(bt))n+=70;
    if(s.includes("familia")||s.includes("relacionamentos"))if(/casamento|mulher|family|marry|amor|intimacy|sex/.test(bt))n+=60;
    if(s.includes("maldic")||s.includes("liberta"))if(/curse|maldic|altar|spirits|deliverance/.test(bt))n+=60;
    return n;
  }

  function related(title,segment){
    const all=flat();
    const ranked=all.map(b=>({...b,_score:score(b,title,segment)})).filter(b=>b._score>0).sort((a,b)=>b._score-a._score);
    if(ranked.length)return ranked.slice(0,2);
    const fallbacks={
      "Altar":["O Poder de Um Altar","Como Destruir o Altar Satânico"],
      "Oração":["A Chave Mestre da Oração","Abc da oração"],
      "Família e Relacionamentos":["Segredos de um Casamento Feliz","Rei trate sua mulher como uma rainha"],
      "Maldições e Família":["How To Break Generational Curses","Como Destruir o Altar Satânico"],
      "Libertação":["Marine Spirits: Diagnosis and Deliverance","How To Break Generational Curses"],
      "Cura e Milagres":["Fortalecidos pelo sangue de Jesus","Da dor a vitória"],
      "Fé":["O Homem de Fé","Seis obstáculos da Fé"],
      "Profético":["O Homem de Fé","Saia Do Canto Da Vida"],
      "Bênçãos":["A Lei da Contribuição","Prosperidade Total Na Vida"],
      "Ensino e Pregação":["A Chave Mestre da Oração","O Homem de Fé"]
    };
    return (fallbacks[segment]||[]).map(x=>all.find(b=>b.title===x)).filter(Boolean).slice(0,2);
  }

  function inject(){
    document.querySelectorAll("#grid .card").forEach(card=>{
      if(card.querySelector(".related-books"))return;
      const title=card.querySelector(".card-body h3")?.textContent||"";
      const meta=card.querySelector(".meta")?.textContent||"";
      const segment=meta.includes(" - ")?meta.split(" - ").pop().trim():"Ensino e Pregação";
      const items=related(title,segment);
      if(!items.length)return;
      const box=document.createElement("div");
      box.className="related-books";
      box.innerHTML='<div class="related-books-head"><span>📚</span><div><strong>Livro relacionado</strong><small>Continue este tema em profundidade</small></div></div><div class="related-books-grid">'+items.map(b=>'<a class="related-book" href="'+b.affiliate_link+'" target="_blank" rel="noopener sponsored"><img src="'+(b.cover||"")+'" alt="'+b.title+'" loading="lazy" referrerpolicy="no-referrer"><div class="related-book-info"><strong>'+b.title+'</strong><small>'+b.bookCategory+'</small><span>🛒 Comprar na Amazon</span></div></a>').join("")+'</div>';
      card.querySelector(".card-body")?.appendChild(box);
    });
  }

  async function start(){
    try{
      const r=await fetch(BOOKS_URL+"?v=1",{cache:"no-store"});
      if(!r.ok)throw new Error("books");
      books=await r.json();
      inject();
      const grid=document.querySelector("#grid");
      if(grid)new MutationObserver(()=>inject()).observe(grid,{childList:true});
    }catch(e){console.warn("[Biblioteca Profética] catálogo não disponível",e)}
  }
  start();
})();