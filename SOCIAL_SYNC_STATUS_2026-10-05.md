# Henry Otasowere Vitrine — Sincronização Social

Data: 2026-10-05

## Regra implementada

Cada vídeo pertence a um segment. O segmento é a chave de relacionamento entre YouTube, Facebook, Instagram e TikTok. O catálogo usa published_at/upload_date para ordenar do mais recente para o mais antigo; o seletor também permite inverter para antigos primeiro.

## Catálogo atual

- Total: 368 vídeos
- YouTube: 368
- Facebook: 0
- Instagram: 0
- TikTok: 0

## Testes de coleta

- YouTube: coleta local com yt-dlp concluída e catálogo reconstruído.
- TikTok @vozdacura: yt-dlp informou que a conta não possui vídeos publicados; nenhum item foi inventado.
- Facebook mvozdacura: yt-dlp 2026.08.19 retornou Unsupported URL.
- Instagram: não foi possível obter uma lista pública verificável de vídeos através do coletor local atual.

## Segurança de dados

Nenhum vídeo de Facebook, Instagram ou TikTok foi fabricado ou atribuído por aproximação. A vitrine abre a pesquisa do mesmo segmento nessas redes até que uma URL de vídeo seja efetivamente coletada/verificada.

## Arquivos de controle

- build_catalog.py: normaliza e une registros.
- social_catalog.json: entrada para registros sociais verificados.
- videos.json: catálogo final unificado.
- app.js: agrupamento por segmento e ordenação cronológica.
- VITRINE_SPEC_2026-10-05.md: especificação/auditoria.

## Validação

node --check app.js — OK
python -m py_compile build_catalog.py — OK
python -m json.tool videos.json — OK
python -m json.tool social_catalog.json — OK
python build_catalog.py — OK
FINAL_TEST_OK — OK
