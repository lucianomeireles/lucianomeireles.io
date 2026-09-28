# Plano

Uma única página estática, pensada primeiro para o celular. Quem chega quer entender um histórico profissional, então a visita tem foco comercial: o texto precisa ser legível, e no fim a pessoa encontra como entrar em contato.

O fundo é um universo em movimento — estrelas, poeira, galáxias e nebulosas coloridas — sobre preto. O cursor não interfere nele. O texto sobe em perspectiva como na abertura do filme, sem a introdução que a antecede. `references/star-wars-abertura.jpg` é referência de tratamento, não de um quadro único. Inglês, espanhol e português, com a escolha guardada num cookie. Esta versão não tem som.

## Decisões

- Next.js com App Router e `output: 'export'`. O resultado é um conjunto de arquivos estáticos, sem servidor.
- Publicar na Vercel, no plano gratuito, com o domínio apontando para lá. É o caminho de custo zero e com menos peça para operar.
- O export estático continua válido para S3 + CloudFront se mais tarde a publicação for para a conta AWS onde o domínio está registrado. Nada da aplicação depende da Vercel.
- Não há letreiro nem linha de abertura: a página começa direto no texto em perspectiva. O logotipo e o texto do filme não entram no site.
- A fonte é uma gothic condensada com licença aberta, hospedada junto com o site. A cor e o desenho do texto ficam para quando o conteúdo real entrar. Até lá, o ponto de partida é `#FFE81F`.
- O conteúdo desta etapa é Lorem Ipsum nos três idiomas, no formato final, para testar o mecanismo. O texto real e os endereços de contato entram depois.
- O fundo da página é `#181818`, o quase-preto da interface escura do Cursor. Estrelas, poeira, galáxias e nebulosas carregam a cor. O claro do canvas é esse mesmo preto, para não aparecer outra cor nas bordas.

## A página

Tela cheia, `100dvh`, fundo `#181818`, sem rolagem do documento. A roda do mouse não move a página: move o texto.

Duas camadas:

1. Canvas do universo, cobrindo a viewport. É desenhado num worker, como explicado abaixo.
2. HTML do texto, por cima, numa coluna estreita e centralizada. O texto é HTML de propósito: troca de idioma, leitor de tela e quebra de linha ficam naturais.

O controle de idioma fica sempre visível, num canto, em baixa opacidade: `EN`, `ES`, `PT`. Permanece durante toda a sequência, inclusive no fim. É a única interface fixa.

## A sequência

Cada etapa espera a anterior.

1. O universo entra com um fade curto.
2. Assim que o céu aparece e o idioma está resolvido, o texto sobe em perspectiva: linha de episódio, título e parágrafos. Entra por baixo, passa legível pelo meio e se dissolve no ponto de fuga. No trecho final, o bloco inteiro esmaece até sumir de fato.
3. Com o texto fora de cena, três links sobem de baixo da tela e param no centro: e-mail, LinkedIn e GitHub. Reais e grandes o bastante para tocar, na mesma família visual do texto, sem card. Se a pessoa volta o texto, a fileira desce e sai; ao chegar de novo ao fim, ela retorna. Os endereços ainda não existem: a fileira entra com destinos de preenchimento.

O avanço automático é lento o bastante para ler sem tocar. A duração fina espera o texto real; com o Lorem Ipsum, o critério é conseguir ler um parágrafo no meio da coluna sem usar a roda.

`prefers-reduced-motion` pula as esperas: o texto já está pronto para ler, o avanço automático fica desligado, e os links de contato estão disponíveis sem atravessar a sequência — na borda de baixo, para não cobrir o texto.

## O universo

O fundo é a peça principal da experiência. Ele roda inteiro na GPU, fora da thread principal, e se ajusta ao aparelho. O celular é o alvo de referência: o que roda liso num celular intermediário define a base, e o desktop ganha mais densidade e resolução em cima disso.

### Motor

- **WebGL2 com shaders próprios, sem Three.js.** O renderizador é pequeno — alguns KB — e só faz o que esta cena precisa. Three.js somaria centenas de KB para usar uma fração.
- **WebGPU fica fora da primeira versão.** A cena não precisa de compute shader: as estrelas são calculadas sem estado, a partir da semente e do tempo. WebGL2 roda em praticamente todo celular, inicia mais rápido e já entrega o efeito inteiro. Se um dia a cena crescer para milhões de partículas simuladas, a troca para WebGPU fica isolada no renderizador.
- **OffscreenCanvas num Web Worker.** O canvas é transferido para um worker, e todo o desenho acontece lá. A thread principal fica só com o texto, a roda, o toque e o React; o fundo não disputa quadro com a rolagem, e a rolagem não trava o fundo. Onde o OffscreenCanvas não existir, o mesmo código roda na thread principal.
- O worker recebe só o tamanho da tela, a visibilidade da aba e a preferência de movimento reduzido, por mensagem. Nenhum dado por estrela atravessa as threads.

### Camadas da cena

1. **Céu profundo.** Galáxias distantes, nebulosas e poeira coloridas, geradas por ruído procedural num shader. A cor vive nesses elementos. O claro por trás deles continua `#181818`. É desenhado uma vez numa textura de meia resolução e só é refeito no redimensionamento. A cada quadro, a textura desliza muito devagar, então o custo contínuo é uma leitura de textura.
2. **Estrelas.** Pontos instanciados em três profundidades. As distantes são muitas, pequenas e lentas; as próximas são poucas, maiores e mais rápidas, e isso dá paralaxe. A posição de cada estrela é calculada no vertex shader a partir da semente e do tempo — sem simulação, sem buffer atualizado por quadro. O brilho cintila por um ruído barato. As maiores levam um halo curto, feito no fragment shader do próprio ponto.
3. **Passada final.** Um quad de tela cheia junta as duas camadas.

O canvas não recebe clique nem reage ao ponteiro. O céu segue vivo sozinho — deriva, cintilação e paralaxe — sem nada disputando a atenção com o texto.

### No celular

- Um arraste vertical do dedo desloca o texto. É lido na janela com Pointer Events, então o texto por cima não bloqueia o gesto.
- Um toque curto não faz nada.

### Desempenho

- **Qualidade adaptativa.** O renderizador começa num nível conservador e mede o tempo de quadro. Se sobra folga, sobe; se passa do orçamento por alguns quadros seguidos, desce. Os níveis mexem em três coisas:
  - resolução do canvas, com DPR limitado a 1,5 no celular e 2 no desktop;
  - quantidade de estrelas.
- **Orçamento.** 60 quadros por segundo estáveis num celular intermediário. Em tela de 120 Hz, a cena usa a taxa da tela se o nível alto couber; senão, fica em 60.
- **Sem alocação por quadro.** Buffers, texturas e uniforms são criados no início e só reescritos. Não há coleta de lixo no meio da animação.
- **Pausa.** A aba oculta para o loop. `webglcontextlost` é tratado e a cena é refeita sem recarregar a página.
- **Carregamento.** A página abre no `#181818`. O renderizador é carregado depois do primeiro quadro, e o céu entra com um fade curto, antes do texto. Não há fonte, imagem, áudio ou biblioteca 3D bloqueando nada. O código do fundo fica abaixo de 20 KB comprimido.
- **Sem WebGL2.** Um campo de estrelas estático em CSS, em gradientes radiais, sem animação.

### Acessibilidade

`prefers-reduced-motion` congela a deriva e a cintilação. O céu fica como uma imagem parada: galáxias, estrelas e nada se mexendo.

## O texto

Um valor só, `offset`, descreve o quanto o texto já subiu. Um `requestAnimationFrame` soma um passo constante enquanto a aba está visível. A roda soma ou subtrai nesse mesmo valor. Os dois convivem: sem ninguém na roda, o texto segue; um giro desloca a posição e o avanço automático continua de onde ela ficou.

O intervalo é limitado. O texto entra por baixo, passa legível pelo meio e segue rumo ao ponto de fuga. O percurso vai além da última linha, e no trecho final o bloco inteiro esmaece até sumir. Só então o avanço para e a fileira de contato sobe de baixo até o centro. Girar a roda para cima volta o texto e a fileira desce e sai; ao soltar, o texto torna a subir.

O plano do texto usa perspectiva CSS de um ponto: o bloco inclina para trás, as linhas continuam horizontais e encolhem com a distância. Um degradê no topo dissolve o trecho que já ficou pequeno. Sobem a linha de episódio, o título e os parágrafos.

A coluna é estreita. O título é um pouco maior que o parágrafo. Cada linha é centralizada.

O arraste vertical produz o mesmo deslocamento da roda. Um toque curto não desloca. As setas do teclado também movem o texto, para quem não tem roda.

`prefers-reduced-motion` não rouba o texto: o avanço automático fica desligado e a roda, o arraste e as setas continuam valendo. O HTML do texto permanece no documento para o leitor de tela.

## Idioma

Três dicionários no repositório, `en`, `es` e `pt`, com a mesma forma:

- linha de episódio
- título
- parágrafos
- rótulos dos três links

Os destinos de contato são os mesmos nos três idiomas nesta etapa. Os parágrafos são Lorem Ipsum.

Ordem para escolher o idioma:

1. Cookie `locale`, se o valor for `en`, `es` ou `pt`.
2. Senão, o primeiro idioma do browser cujo prefixo seja `pt`, `es` ou `en` (`pt-BR` cai em `pt`).
3. Senão, inglês.

A página pinta o `#181818` e o céu na hora. O texto só entra depois que essa ordem resolve, para não piscar o idioma errado. `document.documentElement.lang` acompanha a escolha.

Trocar pelo controle grava o cookie (`Path=/`, `SameSite=Lax`, um ano) e substitui o dicionário sem recarregar. O `offset` do texto não muda.

## Ordem de construção

1. Criar o app Next.js estático e uma página preta em tela cheia.
2. Montar o renderizador WebGL2 no worker com OffscreenCanvas, com o caminho de reserva na thread principal e o fundo CSS para quando não houver WebGL2.
3. Desenhar as estrelas instanciadas em três profundidades, com deriva, paralaxe e cintilação.
4. Gerar o céu profundo — galáxias e nebulosas — na textura de meia resolução.
5. Ligar a qualidade adaptativa e medir num celular real. Só depois seguir para o texto.
6. Montar o texto em perspectiva avançando sozinho assim que o céu aparece, com o esmaecimento final.
7. Ligar roda, arraste vertical e setas no mesmo `offset`, com o limite de começo e fim. O toque curto não desloca o texto.
8. No fim do texto, subir e-mail, LinkedIn e GitHub até o centro, e escondê-los quando a pessoa volta o texto.
9. Colocar os três dicionários em Lorem Ipsum, a resolução cookie → browser → inglês, e o controle sempre visível.
10. Ajustar coluna, inclinação, degradê e ritmo de leitura olhando `references/star-wars-abertura.jpg`. A cor do texto permanece a de partida.
11. Publicar o export na Vercel e apontar o domínio.

Cada passo é verificável no browser antes do seguinte. No 5, medir com o painel de desempenho num celular intermediário, com o texto rolando por cima: nenhum quadro longo durante o arraste. No 10, conferir desktop e um viewport estreito: um parágrafo no meio da coluna precisa ser legível sem tocar, o arraste vertical precisa substituir a roda, e os três links precisam ser tocáveis no fim.

## Em aberto

- O texto real.
- A cor e o desenho finais do texto.
- Os endereços de e-mail, LinkedIn e GitHub.
- Título, frase e imagem de quando o link é colado, e o DNS do domínio na AWS, inclusive se há e-mail que precise continuar funcionando.
