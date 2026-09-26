(() => {
  const STORAGE_KEY = "vozCuraWelcome";
  const MIN_CLOSED_MS = 3 * 60 * 1000;
  const phrases = [
    "Vai dar tudo certo.",
    "Relaxa, já deu tudo certo.",
    "Deus está trabalhando em você.",
    "Que horação é a minha hora.",
    "Chuva de bênçãos na sua vida.",
    "Se Deus é por nós, quem será contra nós?",
    "Se você está cansado e sobrecarregado, venha até Jesus."
  ];

  const now = Date.now();
  let state = {};
  try { state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch {}

  const shouldShow = !state.lastClosedAt ||
    (now - Number(state.lastClosedAt) >= MIN_CLOSED_MS);
  if (!shouldShow) return;

  let index = Number.isInteger(state.nextIndex) ? state.nextIndex : 0;
  if (index < 0 || index >= phrases.length) index = 0;

  const modal = document.querySelector("#welcomeModal");
  const phrase = document.querySelector("#welcomePhrase");
  if (!modal || !phrase) return;

  phrase.textContent = phrases[index];
  modal.hidden = false;
  document.body.classList.add("welcome-open");

  const close = () => {
    modal.hidden = true;
    document.body.classList.remove("welcome-open");
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        nextIndex: (index + 1) % phrases.length,
        lastClosedAt: Date.now()
      }));
    } catch {}
  };

  document.querySelector("#closeWelcome").onclick = close;
  modal.addEventListener("click", e => {
    if (e.target === modal) close();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.hidden) close();
  });

  // Marca a saída da página. O limite de 3 minutos impede
  // que a mensagem apareça novamente em cada retorno rápido.
  const markClosed = () => {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...current,
        lastClosedAt: Date.now()
      }));
    } catch {}
  };
  window.addEventListener("pagehide", markClosed, { once: true });
})();