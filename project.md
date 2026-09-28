# lucianomeireles.io

Site estático pessoal, com foco comercial: quem chega quer entender o histórico profissional. Publicado no domínio já registrado na AWS. Esta versão não tem som.

## Forma

- Aplicação estática em Next.js.
- Publicação o mais barata possível. A escolha está no plano: Vercel, com o export estático também servindo para CloudFront.

## Conceito visual

A página segue a sequência da introdução de *Star Wars*. A imagem é referência de tratamento, não de um quadro único.

- O fundo é preto, no quase-preto da interface do Cursor. Estrelas, poeira, galáxias e nebulosas são coloridas e ficam em movimento contínuo. O cursor não interfere no fundo.
- Mobile first. O fundo precisa rodar liso e rápido no celular, sem travar.
- Sem introdução: o texto começa a subir em perspectiva assim que o céu aparece.
- Sem interação, o texto avança sozinho, num ritmo em que dá para ler. A roda do mouse desloca o texto para cima ou para baixo.
- No fim o texto some por completo, e e-mail, LinkedIn e GitHub sobem de baixo até o centro da página.
- Até o conteúdo real, o texto é Lorem Ipsum, para testar o mecanismo.

Referência visual: `references/star-wars-abertura.jpg`.

O que a imagem fixa para o tratamento:

- Tela cheia. O preto da referência, na página, é o quase-preto do Cursor. As estrelas são pontos esparsos, de tamanho e brilho variados; algumas maiores têm um leve brilho.
- A cor do texto fica para o conteúdo real. O ponto de partida é o amarelo da abertura.
- Perspectiva de um ponto. O plano do texto inclina para trás e converge no centro, na parte de cima do quadro. As linhas continuam horizontais e encolhem com a distância.
- Duas profundidades ao mesmo tempo: o bloco legível no meio, grande, e o trecho que já passou, minúsculo e quase dissolvido antes de chegar ao topo.
- O texto fica numa coluna estreita e centralizada. O título do episódio é um pouco maior que o parágrafo. Cada linha é centralizada, com comprimentos diferentes.
- O logotipo da referência não entra no site.

## Idioma

- Inglês, espanhol e português.
- O idioma inicial vem da região do próprio browser.
- O visitante pode trocar o idioma, e a escolha fica salva em um cookie.
- O controle de idioma fica sempre visível.
