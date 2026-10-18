# Uligod's MTG Builder — Índice e mapa do projeto

Objetivo: reunir tudo o que é preciso para dominar Magic: The Gathering **no MTG Arena** e construir a app **Uligod MTG Deck Builder** (Standard + Alchemy, depois Historic/Brawl). Última verificação de dados voláteis: **2026-10-18**. Língua: português de Portugal (nomes de cartas em inglês, como no cliente).

## Perfil de jogo
- Jogador: **Uligod** — ID do MTG Arena: **Uligod#61320**.
- Joga no **telemóvel** (Android); tem também o Arena instalado no **PC** (usado para exportar o `Player.log`).
- Formatos principais: **Standard e Alchemy**.
- Conta: 84 decks próprios (47 Standard, 35 Alchemy, 1 Historic, 1 «3 Sets») + 93 pré-construídos da Wizards (ignorar). `Destruction Derby (S)` tem 130 cartas de propósito (deck de teste).

## Estado da app (2026-10-18)
- **Publicada** em https://uligod-31.github.io/uligod-mtg/ (GitHub Pages, repositório público `uligod-mtg`). O utilizador publicou à mão: o conector do GitHub não ficou disponível na sessão de trabalho. O Hostinger fica reservado a outro projeto (sem misturas).
- **Conta de utilizador** criada, email confirmado e login testado na app publicada. **MFA ativado** pelo utilizador no Supabase (declarado por ele; o conector não o lê).
- **Registos novos desativados** no Supabase; o utilizador testou «Criar conta» e a app recusou. Decisão: **manter o botão «Criar conta» visível** (já está bloqueado no servidor).
- **Dados na conta:** 84 decks (2669 linhas, 5451 cartas) e a carteira (wildcards 67/56/23/12, 350 de ouro, 1340 gemas, cofre 76,1 %) migrados a partir da área de preparação. A app mostra os 84 decks; 2 têm problemas de legalidade.
- **Atalho no Android (PWA):** `manifest.webmanifest` e `sw.js` estão online. Os ícones `icon-192.png` e `icon-512.png` que carregaste eram o **mesmo ficheiro de 192×192**; o `icon-512.png` novo (512×512 real, ampliado do 192) está na entrega de 2026-10-18 e **tem de ser carregado no repositório**. Manifest v2: ícones «any» e «maskable» em entradas separadas, `id`, orientação vertical. `sw.js` v3 (cache `uligod-mtg-shell-v3`).
- **Imagens das cartas (2026-10-18):** miniaturas nas listas e janela da carta (imagem grande, custo, tipo, texto Oracle, raridade, set, legalidade, quantidade no deck, anterior/seguinte). A base de dados guarda **só a face frontal** (`cards.image_uri`, todas `/normal/front/`). Poder/resistência e lealdade ficam só na imagem (decisão do utilizador).
- **Virar carta (corrigido a 2026-10-18):** o botão antigo adivinhava o URL do verso e aparecia também em aventuras. Agora o verso tenta, por ordem: `api.scryfall.com/cards/<id>?format=image&face=back`, depois o caminho `/back/` do CDN; o botão não aparece em aventuras; sem verso, mostra aviso. **Por testar no telemóvel** (a ferramenta de trabalho não consegue abrir imagens do Scryfall). Das 800 cartas com «//», só as de duas faces reais têm verso.
- **Outras correções (2026-10-18):** ao sair da conta fecham-se as folhas de deck abertas e limpam-se os dados em memória; o arranque de dados após login saiu de dentro do callback de autenticação (evita bloqueios do Supabase).
- **Ficheiros da app guardados no Projeto:** `claude/app/index.html`, `claude/app/sw.js`, `claude/app/manifest.webmanifest` (versão de 2026-10-18). Os ícones são binários e ficam só no repositório/entrega. **Regra:** a cada alteração à app, atualizar estes ficheiros no Projeto e este índice.
- Detalhes técnicos em `mtg-app-base-de-dados.md` e decisões em `mtg-app-visao-e-requisitos.md`.

## Decisões em vigor
- **Scryfall: de novo permitido (2026-10-18).** A restrição anterior existia só porque a ligação não funcionava; o utilizador levantou-a e autorizou usar o que for útil (imagens em `cards.scryfall.io`, dados de cartas). O utilizador tem conta no Scryfall (nome Ulipirex), mas a API pública não a exige. Nota: a API `api.scryfall.com` bloqueou pedidos automáticos desta ferramenta (deteção de bots); as imagens carregam no browser do utilizador. O catálogo (cerca de 20 100 cartas) mantém-se.
- **O Scryfall não guarda coleções nem liga a contas do Arena** (é uma base de dados de cartas com pesquisa e API, tanto quanto se sabe; sem fonte oficial que o contradiga). A coleção do utilizador tem de vir de outra via.
- **Coleção:** o `Player.log` atual não a contém (verificado em 4 ficheiros). Via escolhida em curso: capturas de ecrã da Coleção por set (começar por FDN) ou marcação manual por set. A coleção continua **vazia** na conta.
- Os `arena_id` em falta (Alchemy FRA, Y26) serão completados a partir do `Player.log` e dos decks.

## Documentos (ordem de leitura sugerida)
1. `mtg-app-visao-e-requisitos.md` — objetivos, decisões, acesso a dados, arquitetura, perguntas em aberto.
2. `mtg-passos-exportar-player-log.md` — o que o log contém e não contém, decks e carteira da conta.
3. `mtg-alchemy-guia.md` — Alchemy: sets legais, mecânicas digitais, fim do formato.
4. `mtg-formatos-e-banlists.md` — formatos do Arena, banlists, calendário.
5. `mtg-regras-essenciais.md` e `mtg-regras-avancadas.md` — regras e interface.
6. `mtg-construcao-de-decks.md` — arquétipos, terrenos, fontes de cor, wildcards.
7. `mtg-metagame-2026-10.md` — metagame (Standard e Pioneer).
8. `mtg-brawl-arena.md` — Brawl, Competitive Brawl, Standard Brawl.
9. `mtg-ferramentas-mtgoracle.md` — mtgoracle.gg e outras ferramentas.
10. `mtg-jogo-competitivo.md` — ladder, eventos, treino.
11. `mtg-commander.md` — referência de papel.
12. `mtg-glossario-en-pt.md` — glossário EN↔PT-PT.
13. `mtg-app-base-de-dados.md` — esquema e estado do Supabase.

## Datas que obrigam a atualizar
- **24–25 e 30 de outubro, 31 de outubro–1 de novembro de 2026:** Qualifier Play-Ins e Qualifier Weekend (Standard).
- **30 de novembro de 2026:** próximo anúncio de Banned & Restricted (papel); rever também as notícias do Arena.
- **2 de fevereiro de 2027:** rotação do Standard e **remoção do formato Alchemy**.

## Princípios do projeto
- **Fonte de verdade:** cliente do Arena, Comprehensive Rules, Oracle e anúncios oficiais.
- **Dados voláteis datados**; afirmações importantes com fonte ou marcadas como heurística.
- **Dados pessoais:** não guardar emails nem credenciais nos ficheiros do projeto.
- **Acesso ao Arena:** só por leitura de ficheiros locais (`Player.log`); nunca por credenciais.

## Limites conhecidos
- Sem coleção não há «o que falta craftar» nem «decks que já consigo montar».
- Metagame com percentagens específicas do Arena ainda não recolhido.
- Banlists lidas por ferramenta automática: confirmar nomes no cliente.
- Pendentes: último anúncio de banlist (12/out/2026), sets legais em Standard no Arena (FRA aparece em decks de Standard), 42 `arena_id` de decks fora do catálogo, confirmar os ícones e a instalação da app no Android, carregar no repositório o conjunto de 2026-10-18 (`index.html`, `sw.js` v3, `manifest.webmanifest`, `icon-512.png` novo) e testar no telemóvel o virar carta e a instalação do atalho
