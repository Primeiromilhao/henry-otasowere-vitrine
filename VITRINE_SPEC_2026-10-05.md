# Vitrine Henry Otasowere — Especificação 2026-10-05

## 1. Organização por seguimento
O assunto é o eixo principal da vitrine.
- YouTube, Facebook, Instagram e TikTok entram na mesma estrutura de tema.
- Ao selecionar um assunto (ex.: Altar), a vitrine reúne os vídeos catalogados desse mesmo seguimento, independentemente da plataforma.
- Dentro da visão geral, vídeos continuam agrupados por canal para facilitar navegação.
- A classificação inicial usa título, categoria, descrição, tags e canal.
- Canais novos podem ser acrescentados ao catálogo sem alterar a interface.

## 2. Biblioteca Profética
- Cada seguimento possui uma seção de livros relacionados.
- A vitrine lê books.json.
- O catálogo pode apontar para os PDFs existentes em F:\teologia\Sala de Aula\biblioteca_estudos.
- Quando um assunto é selecionado, livros do mesmo tema aparecem abaixo dos vídeos.

## 3. Retomada de vídeo
- O ponto de reprodução é salvo em localStorage por vídeo/plataforma.
- Ao abrir novamente o mesmo vídeo após ter parado, a interface pergunta:
  "Continuar de onde parou?" ou "Começar novamente".
- A abertura em "Continuar" usa o ponto salvo.
- Não há autoplay na entrada da página.
- O ponto continua disponível depois de sair/fechar a página, desde que o navegador preserve o armazenamento do site.

## 4. Segurança do comportamento
- Nenhum vídeo externo é baixado pela vitrine.
- Links usam target=_blank e rel=noopener.
- Conteúdo textual do catálogo é escapado antes de ser inserido no DOM.
- Estado de retomada fica local ao navegador.

## 5. Próxima fase
Integrar feeds/catálogos autorizados de Facebook, Instagram e TikTok e expandir o índice da Biblioteca Profética por tema, canal, autor e livro.


## Correção de segmentação — 2026-10-05
- Segmentos fixos agora incluem Altar, Oração, Financeiro, Cura e Milagres, Libertação, Maldições e Família, Família e Relacionamentos, Fé, Profético e Unção e Óleo.
- Ao selecionar um segmento, o catálogo filtra pelo mesmo assunto independentemente da plataforma registrada no catálogo.
- Ordenação agora possui Mais recentes primeiro, Mais antigos primeiro e Título.
- Adicionado `social_sources.json` com as fontes oficiais do Ministério Voz da Cura e pesquisas por assunto para YouTube, Facebook, Instagram e TikTok.
- Importante: a enumeração anônima de vídeos do Facebook/Instagram/TikTok não está estável no ambiente atual; portanto a interface não declara esses vídeos como 'coletados' enquanto não houver registros reais no catálogo. Quando houver registros `platform=facebook|instagram|tiktok`, eles entram automaticamente no mesmo segmento e na mesma ordenação.


## 2026-10-05 — Segmentação cross-platform finalizada

- Ao entrar em um segmento (ex.: **Altar**), o catálogo filtra os vídeos pelo mesmo assunto.
- Abaixo dos vídeos já catalogados aparece uma camada **BUSCA NAS REDES** com pesquisa temática direta para YouTube, Facebook, Instagram e TikTok.
- A pesquisa usa o assunto selecionado + Henry Otasowere, evitando misturar temas.
- O catálogo local suporta ordenação **Mais recentes**, **Mais antigos** e **Título**.
- A ordenação local usa upload_date; quando uma rede externa não fornece uma data confiável ao navegador, a ordenação é delegada à própria rede.
- Facebook/Instagram/TikTok não expõem de forma estável um catálogo público de vídeos para um site estático; por isso o sistema não inventa resultados. Ele abre a pesquisa temática real da plataforma.
- O botão **↻ Atualizar** força nova leitura de videos.json e books.json sem sair da página.
- O progresso de vídeos já catalogados continua guardado localmente.
- Auditoria: alterações registradas neste arquivo para rastreabilidade da Fábrica/Vitrine.


## 2026-10-05 — Relação por segmento e sincronização social
- O campo `segment` passa a ser a chave canônica para relacionar o mesmo assunto entre plataformas.
- A ordenação usa `published_at` quando disponível e `upload_date` como fallback.
- Padrão da interface: mais recentes primeiro; opção: mais antigos primeiro.
- `social_catalog.json` foi criado para receber somente URLs/metadados sociais efetivamente verificados.
- Facebook/Instagram/TikTok não são preenchidos por aproximação: os testes locais atuais não forneceram registros verificáveis.
- A interface mantém busca direta pelo mesmo segmento nessas redes enquanto a coleta verificável não estiver disponível.
- Auditoria detalhada registrada em `SOCIAL_SYNC_STATUS_2026-10-05.md`.
