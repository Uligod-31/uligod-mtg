/* Service worker mínimo: só guarda a «casca» da app (mesma origem) e serve-a se estiveres offline.
 * Pedidos ao Supabase, fontes, bibliotecas e imagens das cartas (outras origens) passam sempre pela rede
 * e, no caso das imagens, ficam na cache normal do browser.
 * Estratégia «rede primeiro»: quando publicas uma versão nova do index.html, ela aparece logo.
 * v2: (1) a instalação não falha se faltar um ficheiro da casca (ex.: um ícone); (2) os pedidos da mesma
 * origem revalidam com o servidor em vez de usarem a cache HTTP do GitHub Pages (que dura cerca de 10 min).
 * v3: sem offline, o fallback ignora parâmetros do endereço; só guarda respostas completas (200).
 * v4: novo nome da app (Üligod's MTG Deck Builder) e janela da carta revista; força a renovação da cache.
 * v5: virar carta decidido pelos dados reais do Scryfall; botão Importar/Exportar (formato do Arena) em cada deck. Força a renovação da cache.
 * v6: Importar/Exportar revisto (pré-visualização das diferenças, verificação depois de guardar, nunca apaga cartas por identificar).
 * v7: botão X mais pequeno (20px, com zona de toque maior).
 * v8–v10: acertos de interface (ver histórico do projeto).
 * v11: verificação em dois passos (MFA), recuperação de palavra-passe, tema claro/escuro, edição de decks, importador de coleção
 *      (JSON do tracker/CSV/texto), faces e cartas relacionadas pelo Scryfall com cache, botão «voltar» do Android, dados offline,
 *      gravação segura do Player.log, ícones «maskable».
 * v12: ícones maiores (logótipo a ~72 % do quadrado, como as outras apps) e logótipo no ecrã de entrada.
 * v13: número da versão visível na app (cabeçalho e ecrã de entrada); APP_VERSION no index.html tem de coincidir com este número.
 * v14: cartão «Coleção» com os passos do Tapps Tracker (como administrador).
 * v15: «Atualizar do jogo» (ponte do PC): pedido a partir da app, progresso em tempo real e resumo; ligar/desligar PC.
 * v16: aviso de que o Tapps Tracker precisa de ter registado um jogo para encontrar a coleção.
 * v17: resumo da sincronização com a verificação dos decks contra a coleção (leitor próprio da coleção na ponte).
 * v18: nova paleta (azul, cinzento escuro e fúcsia) e separador Coleção (galeria com filtros, como no Arena).
 * v19: ícones redesenhados na paleta (gerar-icones.ps1).
 * v20: cartas do ícone maiores (preenchem o fundo como os outros ícones).
 * v21: Coleção com Tenho / Faltam / Para os decks (custo de craft em wildcards contra a carteira).
 * v22: coleção coerente: ids do Arena fora do catálogo ligados à carta certa (tabela arena_aliases), «Tenho» junta as edições como o «Faltam».
 * v23: «Faltam» como no Arena: só as cartas que não tens (custo de 1 ou 4 cópias à escolha); «Completar 4×» à parte.
 * v24: ícones dos separadores Decks (caixa de deck) e Coleção (cartas de MTG).
 * v25: ícone Decks redesenhado (caixa de deck vertical com tampa, fecho e emblema em estrela).
 * v26: ícone Decks em perspetiva (caixa fechada, 3 faces) e ícone Coleção com a carta maior, sem riscos laterais.
 * v27: ícone Início em brasão de chamas (ideia do utilizador).
 * v28: ícone Início decalcado da silhueta do símbolo enviado pelo utilizador (preenchido). */
var CACHE = 'uligod-mtg-shell-v28';
var SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-192.png', 'icon-maskable-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) {
        // um a um: se um ficheiro faltar, os outros guardam-se na mesma
        return Promise.all(SHELL.map(function (u) { return c.add(new Request(u, { cache: 'reload' })).catch(function () { /* ignora */ }); }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) { return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // Supabase, fontes, jsdelivr, imagens do Scryfall: sem cache do SW
  e.respondWith(
    fetch(req, { cache: 'no-cache' }).then(function (res) {
      if (res && res.status === 200 && res.type === 'basic') { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () { return caches.match(req, { ignoreSearch: true }).then(function (hit) { return hit || caches.match('index.html'); }); })
  );
});
