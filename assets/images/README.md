# Consciência Negra — dossiê visual

Site escolar sobre o Dia Nacional de Zumbi e da Consciência Negra (20 de novembro),
feito para o **Colégio Estadual 24 de Outubro** (Aracaju–SE).

Pesquisa, textos e desenvolvimento: **Ayrá Santos**.

## Estrutura

```
index.html                  página única
css/style.css               estilos (tema claro e escuro)
js/script.js                menu, tema, mosaico guiado, navegação e galeria
assets/images/              favicon e pranchas ilustradas
assets/images/personagens/  retratos usados na seção Personagens
```

## Mosaico guiado

O botão **Mosaico** (no cabeçalho) abre um percurso em oito etapas que apresenta
o dossiê na ordem e acompanha a leitura:

- **Próximo / Voltar** avançam e retornam uma etapa;
- a trilha de peças permite saltar para qualquer assunto;
- **Ver seção** fecha o mosaico e leva à parte correspondente da página;
- setas do teclado e `Esc` também funcionam;
- o último passo visitado fica salvo no navegador.

## Tema escuro

O botão de sol/lua no cabeçalho alterna entre o tema claro (papel) e o escuro
(preto profundo com terracota). A escolha fica salva em `localStorage`
(chave `cn-tema`) e é aplicada antes da página pintar, sem piscar.

## Personagens e créditos das imagens

As fotos foram baixadas do Wikimedia Commons e estão em
`assets/images/personagens/`.

| Personagem | Arquivo | Autor / origem | Licença |
|---|---|---|---|
| Zumbi dos Palmares | `zumbi.jpg` | Pintura de Antônio Parreiras | Domínio público |
| Dandara dos Palmares | `dandara.png` | Ilustração do projeto EPTrilhas | CC BY 4.0 |
| Nelson Mandela | `mandela.jpg` | Kingkongphoto / celebrity-photos.com | CC BY-SA 2.0 |
| Martin Luther King Jr. | `mlk.jpg` | Phil Stanziola (NYWT&S) | Domínio público |
| Abdias do Nascimento | `abdias.jpg` | Ricardo Stuckert/PR | CC BY 3.0 BR |
| Conceição Evaristo | `conceicao.jpg` | Fora do Eixo | CC BY-SA 2.0 |

Não existe retrato de época de Dandara; por isso a seção usa uma ilustração
do projeto EPTrilhas, com essa informação na legenda.

Os textos de crédito também aparecem embaixo de cada retrato, no site.

## Pranchas da galeria

As seis imagens da seção **Galeria** são ilustrações em SVG feitas para o projeto
(`galeria-01.svg` a `galeria-06.svg`). Para usar fotos:

1. Coloque os arquivos em `assets/images/` (por exemplo, `foto-01.jpg`).
2. No `index.html`, procure os comentários `<!-- PRANCHA 1 ... -->` e troque o `src`:

```html
<!-- Antes -->
<img src="assets/images/galeria-01.svg" alt="..." loading="lazy">

<!-- Depois -->
<img src="assets/images/foto-01.jpg" alt="Descrição real da foto" loading="lazy">
```

3. Ajuste a `alt` e a legenda (`figcaption`).

O ideal é usar imagens quadradas (1:1), com cerca de 1000 px de lado.

## Como abrir

Basta abrir o `index.html` no navegador. Também é possível servir a pasta localmente:

```bash
python3 -m http.server 8765
```

Depois acesse `http://localhost:8765`.

## Fontes

Conteúdo reunido a partir de fontes públicas sobre a história de Palmares,
a Lei 10.639/2003, a Lei 12.519/2011 e a Lei 14.759/2023.
