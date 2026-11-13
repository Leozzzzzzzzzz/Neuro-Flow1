gsap.registerPlugin(
  Draggable,
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  SplitText,
);

//   VIDEO DE FUNDO
window.addEventListener("load", () => {
  const video = document.querySelector(".video");
  const Bg = document.querySelector(".Bg");

  video.autoplay = true;
  video.muted = true;
  video.playsinline = true;
  video.loop = true;
});

//SCROLL SUAVE
ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",

  smooth: 3,
  effects: true,
});

//ANIMACAO INICIAL
gsap.from("main", {
  opacity: 0,
  duration: 1,
});

gsap.from(".tag", {
  y: 20,
  opacity: 0,
  duration: 2,
});

gsap.from(".HeS h1", {
  y: 20,
  opacity: 0,
  duration: 2,
  delay: 0.5,
});

gsap.from(".HeS p", {
  y: 20,
  opacity: 0,
  duration: 2,
  delay: 1,
});

gsap.from(".HeBotoes .botoes", {
  y: 20,
  opacity: 0,
  duration: 2,
  delay: 1.5,
});

// NOT
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

const frameCount = 190;
const images = [];
let imagesLoaded = 0;

// 1. Ajusta as dimensões internas do canvas para ocupar a tela toda
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// 2. Loop de pré-carregamento das imagens
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = `/FramesDovídeo/frame-${String(i).padStart(5, "0")}.webp`;

  img.onload = () => {
    imagesLoaded++;
    // Assim que a primeira imagem carrega, já exibe na tela para o site não ficar em branco
    if (imagesLoaded === 1) {
      resizeCanvas();
      render(0);
    }
  };

  images.push(img);
}

// 3. Função de renderização com cálculo de "object-fit: cover" (não estica a imagem)
function render(frameIndex) {
  const img = images[frameIndex];

  // Garante que a imagem existe e já foi carregada
  if (!img || !img.complete) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Lógica do Aspect Ratio (Cover)
  const hRatio = canvas.width / img.width;
  const vRatio = canvas.height / img.height;
  const ratio = Math.max(hRatio, vRatio);

  const centerShift_x = (canvas.width - img.width * ratio) / 2;
  const centerShift_y = (canvas.height - img.height * ratio) / 2;

  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerShift_x,
    centerShift_y,
    img.width * ratio,
    img.height * ratio,
  );
}

// 4. Atualiza o canvas caso o usuário mude o tamanho da janela do navegador
window.addEventListener("resize", () => {
  resizeCanvas();
  // Pega o frame atual baseado no scroll e redesenha
  const currentProgress = ScrollTrigger.getById("videoScroll")?.progress || 0;
  render(Math.floor(currentProgress * (frameCount - 1)));
});

// 5. Configuração do ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const videoObj = { frame: 0 };

// Criamos a Timeline vinculada ao Scroll
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".not",
    start: "top top",
    end: "+=500% bottom", // Espaço total de rolagem
    pin: true, // Trava a tela durante o processo
    scrub: 0.5,
  },
});

// 1. Animação da troca de frames
tl.to(videoObj, {
  frame: frameCount - 1,
  snap: "frame",
  pin: true,
  ease: "none",
  duration: 4, // Define a proporção de duração da 1ª etapa
  onUpdate: () => {
    // Redesenha o canvas a cada frame
    render(videoObj.frame);
  },
  onComplete: () => {
    // Esse bloco executa no exato instante em que o último frame é atingido
    console.log("Vídeo finalizado! Iniciando o zoom...");
  },
})

  // 2. Animação do Scale (Acontece logo após a conclusão do bloco acima)
  .to(canvas, {
    padding: "0 0",
    scale: 4,
    scrub: true,
    duration: 2.5,
    opacity: 0,
    ease: "power1.in",
  });

//TEXTO
const texto = SplitText.create(".texto .par p ", {
  type: "lines,words,chars",
  mask: "chars",
});

const NR = SplitText.create(".recursos h2", {
  type: "lines,words,chars",
});

gsap.from(texto.chars, {
  y: 60,
  delay: 1,
  opacity: 0,
  stagger: 1.5,
  duration: 20,
  scrollTrigger: {
    trigger: ".texto",
    start: "0% 30%",
    end: "100% 90%",
    scrub: 3,
    pin: true,
    pinSpacing: true,
  },
});

// RECURSOS
gsap.from(NR.chars, {
  y: 10,
  opacity: 0,
  duration: 1,
  stagger: 0.5,

  scrollTrigger: {
    trigger: ".recursos",
    start: "top top",
    end: "center center",
    scrub: 2,
  },
});

gsap.to(NR.chars, {
  opacity: 0,
  duration: 1,
  stagger: 0.5,

  scrollTrigger: {
    trigger: ".recursos",
    start: "bottom 20%",
    end: "bottom center",
    scrub: 2,
  },
});

// PLANOS

gsap.from(".Planos .planos .plano1,.plano2,.plano3", {
  y: 72,
  opacity: 0,
  stagger: 0.5,
  duration: 1,
  scrollTrigger: {
    trigger: ".planos",
    start: " 40% top",
  },
});

gsap.to(".Planos .planos", {
  y: -200,
  duration: 1,
  scrollTrigger: {
    trigger: ".planos",
    start: " 40% top",
    scrub: true,
  },
});

gsap.from(".Planos h2", {
  y: 72,
  opacity: 0,
  duration: 1.5,
  scrollTrigger: {
    trigger: ".planos",
    start: " 50% top",
  },
});

// CARDS

// ========================================
// NEUROFLOW — INFINITE CARD SLIDER
// ========================================

const cards = gsap.utils.toArray(".cards > *");
const dragProxy = document.querySelector(".drag-proxy");
const btnNext = document.querySelector(".direita");
const btnPrev = document.querySelector(".esquerda");

// Verifica se os elementos necessários existem
if (cards.length && dragProxy && btnNext && btnPrev) {
  let spacing = 0.12;

  // Posição inicial dos cards
  gsap.set(cards, {
    xPercent: 400,
    opacity: 0,
    scale: 0,
  });

  // Animação individual de cada card
  const animateCard = (element) => {
    const tl = gsap.timeline();

    tl.fromTo(
      element,
      {
        scale: 0,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        zIndex: 100,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: "power1.in",
        immediateRender: false,
      },
    ).fromTo(
      element,
      {
        xPercent: 400,
      },
      {
        xPercent: -400,
        duration: 1,
        ease: "none",
        immediateRender: false,
      },
      0,
    );

    return tl;
  };

  // Cria a sequência infinita
  const seamlessLoop = buildSeamlessLoop(cards, spacing, animateCard);

  // Objeto que controla a posição da animação
  const playhead = {
    offset: 0,
  };

  const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());

  // Animação responsável por movimentar o loop
  const scrub = gsap.to(playhead, {
    offset: 0,
    duration: 0.5,
    ease: "power3",
    paused: true,

    onUpdate() {
      seamlessLoop.time(wrapTime(playhead.offset));
    },
  });

  // Navegação entre os cards
  function moveSlider(direction) {
    const nextOffset = playhead.offset + spacing * direction;

    scrub.vars.offset = nextOffset;
    scrub.invalidate().restart();
  }

  // Avançar
  btnNext.addEventListener("click", () => {
    moveSlider(1);
  });
  //Voltar
  btnPrev.addEventListener("click", () => {
    moveSlider(-1);
  });

  // Arrastar os cards
  Draggable.create(dragProxy, {
    type: "x",
    trigger: ".cards",

    onPress() {
      this.startOffset = scrub.vars.offset;
    },

    onDrag() {
      scrub.vars.offset = this.startOffset + (this.startX - this.x) * 0.001;

      scrub.invalidate().restart();
    },

    onDragEnd() {
      const snappedOffset = gsap.utils.snap(spacing, scrub.vars.offset);

      scrub.vars.offset = snappedOffset;
      scrub.invalidate().restart();
    },
  });

  // Constrói a sequência infinita
  function buildSeamlessLoop(items, spacing, animateFunc) {
    let overlap = Math.ceil(1 / spacing);

    let startTime = items.length * spacing + 0.5;

    let loopTime = (items.length + overlap) * spacing + 1;

    let rawSequence = gsap.timeline({
      paused: true,
    });

    let seamlessLoop = gsap.timeline({
      paused: true,
      repeat: -1,

      onRepeat() {
        this._time === this._dur && (this._tTime += this._dur - 0.01);
      },
    });

    let length = items.length + overlap * 2;

    let time;
    let index;

    for (let i = 0; i < length; i++) {
      index = i % items.length;
      time = i * spacing;

      rawSequence.add(animateFunc(items[index]), time);
    }

    rawSequence.time(startTime);

    seamlessLoop
      .to(rawSequence, {
        time: loopTime,
        duration: loopTime - startTime,
        ease: "none",
      })
      .fromTo(
        rawSequence,
        {
          time: overlap * spacing + 1,
        },
        {
          time: startTime,
          duration: startTime - (overlap * spacing + 1),
          immediateRender: false,
          ease: "none",
        },
      );

    return seamlessLoop;
  }
}
