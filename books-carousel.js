(function () {
  const BOOKS_URL = "https://raw.githubusercontent.com/Primeiromilhao/blogger_Estudos/main/books_categorized.json";
  const INTERVAL = 180000;
  let books = [], index = 0;

  const normalize = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const rules = {
    "Altar":["altar","satan"], "Oração":["oracao","prayer"],
    "Família e Relacionamentos":["casamento","familia","relacionamento","mulher","marry","amor","intimacy"],
    "Maldições e Família":["curse","generational","maldicao","altar"], "Libertação":["deliverance","libert","spirits","altar","curse"],
    "Cura e Milagres":["cura","milagre","sangue","dor","vitoria","jesus"], "Fé":["fe ","faith","medo","impossivel"],
    "Profético":["profetico","profecia","destino","proposito"], "Bênçãos":["bencao","prosperidade","abundancia","contribuicao","sucesso"],
    "Ensino e Pregação":["ensino","pregacao","vida","carater","pensamento","fe ","oracao"]
  };
  const escapeHtml = (s) => String(s || "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const allBooks = () => books.flatMap(g => (g.books || []).map(b => ({...b, bookCategory:g.category})));

  function currentSegment() {
    const active = document.querySelector("#segments .chip.active");
    return active ? active.textContent.trim() : "Todos";
  }

  function booksForSegment(segment) {
    const all = allBooks();
    if (!segment || segment === "Todos") return all;
    const keys = rules[segment] || [];
    const matches = all.filter(b => keys.some(k => normalize(b.title + " " + b.bookCategory).includes(normalize(k))));
    return matches.length ? matches : all;
  }

  function render() {
    const source = booksForSegment(currentSegment());
    if (!source.length) return;
    document.querySelectorAll(".books-carousel").forEach(slot => {
      const visible = Array.from({length: Math.min(4, source.length)}, (_, n) => source[(index + n) % source.length]);
      const segment = currentSegment();
      slot.innerHTML =
        '<div class="books-carousel-head"><div><span class="eyebrow">LIVROS RELACIONADOS</span><strong>' +
        escapeHtml(segment === "Todos" ? "Biblioteca Profética" : "Livros sobre " + segment) +
        '</strong></div><span class="books-carousel-timer">Mudam automaticamente</span></div>' +
        '<div class="books-carousel-track">' +
        visible.map(b => '<a class="book-slide" href="' + escapeHtml(b.affiliate_link) + '" target="_blank" rel="noopener sponsored">' +
          '<img src="' + escapeHtml(b.cover || "") + '" alt="' + escapeHtml(b.title) + '" loading="lazy" referrerpolicy="no-referrer">' +
          '<div><h3>' + escapeHtml(b.title) + '</h3><small>' + escapeHtml(b.bookCategory) + '</small><span>🛒 Ver na Amazon</span></div></a>').join("") +
        '</div>';
    });
    index = (index + 4) % source.length;
  }

  function start() {
    fetch(BOOKS_URL + "?v=carousel-2", {cache:"no-store"})
      .then(r => { if (!r.ok) throw new Error("Catálogo indisponível"); return r.json(); })
      .then(data => {
        books = data;
        render();
        setInterval(render, INTERVAL);
        const segments = document.querySelector("#segments");
        if (segments) new MutationObserver(() => { index = 0; render(); }).observe(segments, {childList:true, subtree:true, characterData:true});
      })
      .catch(e => console.warn("[Livros] " + e.message));
  }
  window.addEventListener("load", start);
})();
