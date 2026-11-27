/* ============================================================
   CONSCIÊNCIA NEGRA — INTERATIVIDADE
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const raiz = document.documentElement;
  const cabecalho = document.querySelector('.cabecalho');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const topoBtn = document.getElementById('topo-btn');

  /* ---------- Altura real do cabeçalho ---------- */
  function medirCabecalho() {
    if (cabecalho) {
      raiz.style.setProperty('--altura-cabecalho', cabecalho.offsetHeight + 'px');
    }
  }

  medirCabecalho();
  window.addEventListener('resize', medirCabecalho);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(medirCabecalho);
  }

  /* ---------- Menu mobile ---------- */
  function fecharMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove('nav--aberta');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-aberto');
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      const aberta = nav.classList.toggle('nav--aberta');
      menuToggle.setAttribute('aria-expanded', String(aberta));
      menuToggle.setAttribute('aria-label', aberta ? 'Fechar menu' : 'Abrir menu');
      document.body.classList.toggle('menu-aberto', aberta);
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', fecharMenu);
    });

    document.addEventListener('click', function (evento) {
      if (!nav.classList.contains('nav--aberta')) return;
      if (nav.contains(evento.target) || menuToggle.contains(evento.target)) return;
      fecharMenu();
    });
  }

  /* ---------- Tema claro / escuro ---------- */
  const botaoTema = document.querySelector('.botao-tema');
  const metaTema = document.querySelector('meta[name="theme-color"]');

  function temaAtual() {
    return raiz.getAttribute('data-tema') === 'escuro' ? 'escuro' : 'claro';
  }

  function aplicarTema(tema) {
    if (tema === 'escuro') {
      raiz.setAttribute('data-tema', 'escuro');
    } else {
      raiz.removeAttribute('data-tema');
    }

    if (metaTema) {
      metaTema.setAttribute('content', tema === 'escuro' ? '#100D0B' : '#F4EFE6');
    }

    if (botaoTema) {
      const escuro = tema === 'escuro';
      botaoTema.setAttribute('aria-pressed', String(escuro));
      botaoTema.setAttribute(
        'aria-label',
        escuro ? 'Ativar tema claro' : 'Ativar tema escuro'
      );
      botaoTema.setAttribute(
        'title',
        escuro ? 'Ativar tema claro' : 'Ativar tema escuro'
      );
    }

    try {
      localStorage.setItem('cn-tema', tema);
    } catch (e) {}
  }

  aplicarTema(temaAtual());

  if (botaoTema) {
    botaoTema.addEventListener('click', function () {
      aplicarTema(temaAtual() === 'escuro' ? 'claro' : 'escuro');
    });
  }

  /* ---------- Botão voltar ao topo ---------- */
  function aoRolar() {
    if (topoBtn) {
      topoBtn.classList.toggle('topo-btn--visivel', window.scrollY > 600);
    }
    atualizarNav();
  }

  if (topoBtn) {
    topoBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Link ativo na navegação ---------- */
  const linksNav = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const secoes = Array.from(document.querySelectorAll('main section[id]'));

  function atualizarNav() {
    if (!secoes.length || !linksNav.length) return;

    const referencia = window.scrollY + (cabecalho ? cabecalho.offsetHeight : 0) + 120;
    let secaoAtual = '';

    secoes.forEach(function (secao) {
      if (secao.offsetTop <= referencia) secaoAtual = secao.id;
    });

    linksNav.forEach(function (link) {
      link.classList.toggle(
        'ativo',
        link.getAttribute('href') === '#' + secaoAtual
      );
    });
  }

  let agendado = false;
  window.addEventListener('scroll', function () {
    if (agendado) return;
    agendado = true;
    window.requestAnimationFrame(function () {
      aoRolar();
      agendado = false;
    });
  }, { passive: true });

  aoRolar();

  /* ---------- Lightbox da galeria ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbImagem = lightbox ? lightbox.querySelector('.lightbox__imagem') : null;
  const lbLegenda = lightbox ? lightbox.querySelector('.lightbox__legenda') : null;
  const lbContador = lightbox ? lightbox.querySelector('.lightbox__contador') : null;
  const lbFechar = lightbox ? lightbox.querySelector('.lightbox__fechar') : null;
  const lbAnterior = lightbox ? lightbox.querySelector('.lightbox__nav--anterior') : null;
  const lbProxima = lightbox ? lightbox.querySelector('.lightbox__nav--proxima') : null;

  const galeria = Array.from(document.querySelectorAll('.galeria__item')).map(function (item) {
    const img = item.querySelector('img');
    const legenda = item.querySelector('figcaption');
    return {
      src: img ? img.getAttribute('src') : '',
      alt: img ? img.getAttribute('alt') : '',
      legenda: legenda
        ? legenda.textContent.replace(/^\s*\d+\s*/, '').trim()
        : ''
    };
  });

  let indiceAtual = 0;
  let ultimoFoco = null;

  function mostrarImagem(indice) {
    if (!galeria.length || !lbImagem) return;

    indiceAtual = (indice + galeria.length) % galeria.length;
    const dado = galeria[indiceAtual];

    lbImagem.src = dado.src;
    lbImagem.alt = dado.alt;

    if (lbLegenda) lbLegenda.textContent = dado.legenda;
    if (lbContador) lbContador.textContent = (indiceAtual + 1) + ' / ' + galeria.length;

    const temVarias = galeria.length > 1;
    if (lbAnterior) lbAnterior.hidden = !temVarias;
    if (lbProxima) lbProxima.hidden = !temVarias;
  }

  function abrirLightbox(indice, gatilho) {
    if (!lightbox) return;

    ultimoFoco = gatilho || document.activeElement;
    mostrarImagem(indice);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    if (lbFechar) lbFechar.focus();
  }

  function fecharLightbox() {
    if (!lightbox || lightbox.hidden) return;

    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lbImagem) lbImagem.src = '';

    if (ultimoFoco && typeof ultimoFoco.focus === 'function') {
      ultimoFoco.focus();
    }
  }

  document.querySelectorAll('.galeria__item').forEach(function (item, indice) {
    const botao = item.querySelector('.galeria__abrir');
    if (botao) {
      botao.addEventListener('click', function () { abrirLightbox(indice, botao); });
    }
  });

  if (lbFechar) lbFechar.addEventListener('click', fecharLightbox);
  if (lbAnterior) lbAnterior.addEventListener('click', function () { mostrarImagem(indiceAtual - 1); });
  if (lbProxima) lbProxima.addEventListener('click', function () { mostrarImagem(indiceAtual + 1); });

  if (lightbox) {
    lightbox.addEventListener('click', function (evento) {
      if (evento.target === lightbox) fecharLightbox();
    });
  }

  /* ---------- Teclado ---------- */
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
      fecharMenu();
      fecharLightbox();
      return;
    }

    if (!lightbox || lightbox.hidden) return;

    if (evento.key === 'ArrowLeft') {
      evento.preventDefault();
      mostrarImagem(indiceAtual - 1);
    }

    if (evento.key === 'ArrowRight') {
      evento.preventDefault();
      mostrarImagem(indiceAtual + 1);
    }

    if (evento.key === 'Tab') {
      const focaveis = Array.from(
        lightbox.querySelectorAll('button:not([hidden])')
      ).filter(function (el) { return el.offsetParent !== null; });

      if (!focaveis.length) return;

      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    }
  });

  /* ---------- Mosaico guiado ---------- */
  const passos = [
    {
      nome: 'Início',
      titulo: 'Um dossiê em oito paradas',
      texto: 'Este site funciona como um mosaico: cada peça completa a anterior. Em vez de rolar tudo de uma vez, você pode percorrer o conteúdo na ordem, com instruções a cada passo.',
      dica: 'Use Próximo e Voltar para avançar. Se quiser ler a página inteira, toque em “Ver seção” ou feche o mosaico.',
      alvo: '#inicio'
    },
    {
      nome: 'Sobre',
      titulo: 'Por que 20 de novembro?',
      texto: 'A data homenageia Zumbi dos Palmares, morto em 20 de novembro de 1695. Ela nasceu da luta do movimento negro e hoje é o Dia Nacional de Zumbi e da Consciência Negra.',
      dica: 'Na seção Sobre você encontra a ficha do dossiê e a explicação do feriado nacional, criado em 2023.',
      alvo: '#sobre'
    },
    {
      nome: 'História',
      titulo: 'Uma linha do tempo da resistência',
      texto: 'Do Quilombo dos Palmares à Lei 14.759/2023, a cronologia mostra como a data foi construída — e por que ela é política, não apenas comemorativa.',
      dica: 'Leia os anos em ordem. Cada item tem uma frase curta com o fato principal.',
      alvo: '#historia'
    },
    {
      nome: 'Personagens',
      titulo: 'Seis rostos para lembrar',
      texto: 'Zumbi, Dandara, Mandela, Martin Luther King Jr., Abdias do Nascimento e Conceição Evaristo. Cada retrato traz datas, uma biografia curta e o crédito da imagem.',
      dica: 'Passe o dedo ou o mouse sobre as fotos para vê-las coloridas. As legendas indicam a origem de cada imagem.',
      alvo: '#personagens'
    },
    {
      nome: 'Galeria',
      titulo: 'Pranchas que contam histórias',
      texto: 'Seis ilustrações em estilo de linogravura, inspiradas em grafismos afro-brasileiros. Elas podem ser ampliadas para leitura no celular.',
      dica: 'Toque em uma prancha para abrir a imagem inteira. Use as setas ou deslize para passar de uma para outra.',
      alvo: '#galeria'
    },
    {
      nome: 'Atitudes',
      titulo: 'O que fazer depois da leitura',
      texto: 'Quatro atitudes práticas para levar o tema para fora da escola: escutar, estudar, apoiar e ocupar espaços.',
      dica: 'Escolha uma atitude para começar esta semana. Consciência também se pratica no dia a dia.',
      alvo: '#atitudes'
    },
    {
      nome: 'Legado',
      titulo: 'A luta continua',
      texto: 'O dossiê termina com uma citação de Nelson Mandela e um convite: memória, respeito e representatividade transformam a sociedade.',
      dica: 'Leia a citação em voz alta. Depois, se quiser, volte ao início e refaça o percurso.',
      alvo: '#legado'
    },
    {
      nome: 'Projeto',
      titulo: 'Quem fez este trabalho',
      texto: 'O site integra o projeto do Colégio Estadual 24 de Outubro, em Aracaju (SE), e foi pesquisado e desenvolvido por Ayrá Santos.',
      dica: 'A ficha do projeto reúne instituição, cidade, autoria e ano. Obrigado por percorrer o dossiê até aqui.',
      alvo: '#dev'
    }
  ];

  const mosaico = document.getElementById('mosaico');
  const trilhaMosaico = document.getElementById('mosaico-trilha');
  const msNum = document.getElementById('mosaico-num');
  const msTitulo = document.getElementById('mosaico-titulo');
  const msTexto = document.getElementById('mosaico-texto');
  const msDica = document.getElementById('mosaico-dica');
  const msVer = document.getElementById('mosaico-ver');
  const msAtual = document.getElementById('mosaico-atual');
  const msTotal = document.getElementById('mosaico-total');
  const msBarra = document.getElementById('mosaico-barra');
  const msFechar = mosaico ? mosaico.querySelector('.mosaico__fechar') : null;
  const msVoltar = mosaico ? mosaico.querySelector('.botao-mosaico--voltar') : null;
  const msProximo = mosaico ? mosaico.querySelector('.botao-mosaico--proximo') : null;
  const msEtapa = mosaico ? mosaico.querySelector('.mosaico__etapa') : null;

  let passoAtual = 0;
  let ultimoFocoMosaico = null;

  try {
    const salvo = parseInt(localStorage.getItem('cn-mosaico-passo'), 10);
    if (!isNaN(salvo) && salvo >= 0 && salvo < passos.length) passoAtual = salvo;
  } catch (e) {}

  function montarTrilha() {
    if (!trilhaMosaico) return;

    passos.forEach(function (passo, indice) {
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'mosaico__tile';
      botao.dataset.passo = String(indice);
      botao.innerHTML =
        '<span class="mosaico__tile-num">' + String(indice + 1).padStart(2, '0') + '</span>' +
        '<span class="mosaico__tile-nome">' + passo.nome + '</span>';
      trilhaMosaico.appendChild(botao);
    });
  }

  function mostrarPasso(indice) {
    if (!mosaico) return;

    passoAtual = Math.max(0, Math.min(indice, passos.length - 1));
    const passo = passos[passoAtual];

    msNum.textContent = String(passoAtual + 1).padStart(2, '0');
    msTitulo.textContent = passo.titulo;
    msTexto.textContent = passo.texto;
    msDica.textContent = passo.dica;
    msVer.setAttribute('href', passo.alvo);
    msAtual.textContent = String(passoAtual + 1);
    msTotal.textContent = String(passos.length);
    msBarra.style.width = ((passoAtual + 1) / passos.length * 100) + '%';

    if (msVoltar) msVoltar.disabled = passoAtual === 0;
    if (msProximo) {
      msProximo.textContent = passoAtual === passos.length - 1
        ? 'Concluir ✓'
        : 'Próximo →';
    }

    if (trilhaMosaico) {
      Array.from(trilhaMosaico.children).forEach(function (botao, i) {
        botao.classList.toggle('mosaico__tile--ativo', i === passoAtual);
        botao.classList.toggle('mosaico__tile--feito', i < passoAtual);
        if (i === passoAtual) {
          botao.setAttribute('aria-current', 'step');
        } else {
          botao.removeAttribute('aria-current');
        }
      });
    }

    if (msEtapa) msEtapa.scrollTop = 0;

    try {
      localStorage.setItem('cn-mosaico-passo', String(passoAtual));
    } catch (e) {}
  }

  function abrirMosaico(indice) {
    if (!mosaico) return;

    fecharMenu();
    fecharLightbox();
    ultimoFocoMosaico = document.activeElement;
    mostrarPasso(typeof indice === 'number' ? indice : passoAtual);
    mosaico.hidden = false;
    document.body.classList.add('mosaico-aberto');
    document.body.style.overflow = 'hidden';
    document.querySelectorAll('[data-abrir-mosaico]').forEach(function (botao) {
      botao.setAttribute('aria-expanded', 'true');
    });
    if (msFechar) msFechar.focus();
  }

  function fecharMosaico() {
    if (!mosaico || mosaico.hidden) return;

    mosaico.hidden = true;
    document.body.classList.remove('mosaico-aberto');
    document.body.style.overflow = '';
    document.querySelectorAll('[data-abrir-mosaico]').forEach(function (botao) {
      botao.setAttribute('aria-expanded', 'false');
    });

    if (ultimoFocoMosaico && typeof ultimoFocoMosaico.focus === 'function') {
      ultimoFocoMosaico.focus({ preventScroll: true });
    }
  }

  if (mosaico) {
    montarTrilha();
    mostrarPasso(passoAtual);

    document.querySelectorAll('[data-abrir-mosaico]').forEach(function (botao) {
      botao.addEventListener('click', function () {
        const passo = botao.dataset.passo;
        abrirMosaico(passo !== undefined ? Number(passo) : undefined);
      });
    });

    if (msFechar) msFechar.addEventListener('click', fecharMosaico);

    if (msVoltar) {
      msVoltar.addEventListener('click', function () {
        mostrarPasso(passoAtual - 1);
      });
    }

    if (msProximo) {
      msProximo.addEventListener('click', function () {
        if (passoAtual === passos.length - 1) {
          fecharMosaico();
        } else {
          mostrarPasso(passoAtual + 1);
        }
      });
    }

    if (trilhaMosaico) {
      trilhaMosaico.addEventListener('click', function (evento) {
        const botao = evento.target.closest('button[data-passo]');
        if (botao) mostrarPasso(Number(botao.dataset.passo));
      });
    }

    if (msVer) {
      msVer.addEventListener('click', function () {
        fecharMosaico();
      });
    }

    mosaico.addEventListener('click', function (evento) {
      if (evento.target === mosaico) fecharMosaico();
    });

    document.addEventListener('keydown', function (evento) {
      if (mosaico.hidden) return;

      if (evento.key === 'Escape') {
        evento.preventDefault();
        fecharMosaico();
        return;
      }

      if (evento.key === 'ArrowLeft') {
        evento.preventDefault();
        mostrarPasso(passoAtual - 1);
      }

      if (evento.key === 'ArrowRight') {
        evento.preventDefault();
        mostrarPasso(passoAtual + 1);
      }

      if (evento.key === 'Tab') {
        const focaveis = Array.from(
          mosaico.querySelectorAll('button:not([disabled]), a[href]')
        ).filter(function (el) { return el.offsetParent !== null; });

        if (!focaveis.length) return;

        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];

        if (evento.shiftKey && document.activeElement === primeiro) {
          evento.preventDefault();
          ultimo.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
          evento.preventDefault();
          primeiro.focus();
        }
      }
    });
  }

  /* ---------- Fecha o menu ao voltar para desktop ---------- */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) fecharMenu();
  });

  /* ---------- Ano atual no rodapé ---------- */
  const anoAtual = document.getElementById('ano-atual');
  if (anoAtual) {
    anoAtual.textContent = String(new Date().getFullYear());
  }

});
