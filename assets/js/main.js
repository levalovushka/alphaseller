/* Motion for the landing demo.
   Native page scroll, snapped section by section in CSS. No wheel hijacking and no
   smooth-scroll library. The effect copied from cash.app is the one that matters:
   the frame in the middle stays put while the two text columns scroll past it, and
   what the frame holds changes as the section changes.
     1. the ground colour and the ink are interpolated against the scroll,
     2. the frame swaps its slide per section, and becomes the closing call to action,
     3. each section's text reveals once as it enters the viewport.
   The header never hides. */

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const header = document.querySelector('.header');
const frame = document.querySelector('.stage-frame');
const photo = document.querySelector('.stage-photo');
const slides = gsap.utils.toArray('.stage-frame__slide');
const grounds = gsap.utils.toArray('.section');

/* ---------- colour ---------- */

const styles = getComputedStyle(root);
const token = (name) => styles.getPropertyValue(name).trim();

const GROUND = {
  white: token('--c-white'),
  smoke: token('--c-smoke'),
  green: token('--c-green'),
  black: token('--c-black'),
};

const INK = { dark: token('--c-black'), light: token('--c-white') };

/* The counter-ink: what is drawn *on* the ink — a filled button's label, the logo mark
   inside its square. It is the opposite ink, not the ground: on the green hero the ground
   is green, and a green label inside a black pill reads as a mistake. Client call. */
const COUNTER = { dark: INK.light, light: INK.dark };

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}

function mix(from, to, t) {
  const c = from.map((v, i) => Math.round(v + (to[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

function paint(ground, ink, counter) {
  root.style.setProperty('--ground', ground);
  root.style.setProperty('--ink', ink);
  root.style.setProperty('--ink-invert', counter);
}

function coloursOf(el) {
  return {
    ground: rgb(GROUND[el.dataset.theme]),
    ink: rgb(INK[el.dataset.ink]),
    counter: rgb(COUNTER[el.dataset.ink]),
    /* 1 on the one section that is backed by a photograph, 0 everywhere else — it
       cross-fades on the same scroll as the colours. */
    photo: el.dataset.photo === 'true' ? 1 : 0,
  };
}

/* The colour is interpolated across the scroll from one ground to the next, not
   switched at a line and then transitioned. A CSS transition read as lag: it could
   only start once the boundary had passed the header, by which point the section had
   almost arrived, and the fade then ran on after it landed. Here the page finishes
   changing colour at the exact moment the next section reaches the top. */
grounds.forEach((ground, i) => {
  if (i === 0) return;

  const from = coloursOf(grounds[i - 1]);
  const to = coloursOf(ground);

  ScrollTrigger.create({
    trigger: ground,
    start: 'top bottom',
    end: 'top top',
    onUpdate: (self) => {
      const t = self.progress;
      paint(
        mix(from.ground, to.ground, t),
        mix(from.ink, to.ink, t),
        mix(from.counter, to.counter, t)
      );
      photo.style.opacity = String(from.photo + (to.photo - from.photo) * t);
    },
  });
});

/* ---------- slides ---------- */

function showSlide(id) {
  slides.forEach((slide) => {
    slide.dataset.active = String(slide.dataset.for === id);
  });
}

const first = grounds[0];
paint(
  mix(coloursOf(first).ground, coloursOf(first).ground, 0),
  INK[first.dataset.ink],
  COUNTER[first.dataset.ink]
);
showSlide(first.id);

/* Whatever ground sits under the header owns the slide. The switch point is the
   header's own middle, so it lands as the boundary passes the logo.

   Each switch also fires a `section:change` event on `document`, so anything else —
   filling a slide, starting a video, cueing a caption — can hang off it without
   touching this file:

     document.addEventListener('section:change', (e) => {
       e.detail; // { id, theme, ink, isSection, ground }
     }); */
grounds.forEach((ground) => {
  ScrollTrigger.create({
    trigger: ground,
    start: () => `top top+=${header.offsetHeight / 2}`,
    end: () => `bottom top+=${header.offsetHeight / 2}`,
    onToggle: (self) => {
      if (!self.isActive) return;

      const { theme, ink } = ground.dataset;
      const isSection = ground.classList.contains('section');

      if (isSection) showSlide(ground.id);

      document.dispatchEvent(
        new CustomEvent('section:change', {
          detail: { id: ground.id || 'footer', theme, ink, isSection, ground },
        })
      );
    },
  });
});

/* On the way into the closer the frame becomes the call to action: it shrinks to
   200×150 — the same 4:3, just smaller — fills with the brand green, drops its dashed
   outline and brings up its label. All of it scrubbed to the scroll, so it is complete
   exactly when that screen lands.

   The fill is interpolated by hand rather than left to a CSS transition, because it
   starts from the live tint (6% of the current ink) and ends on an opaque green. */
const CTA_WIDTH = 200;
const GREEN = rgb(GROUND.green);
const closer = document.querySelector('#closer');
const cta = frame.querySelector('.stage-frame__cta');
let frameWidth = frame.getBoundingClientRect().width;
let frameTop = 0;

function morph(t) {
  if (t === 0) {
    frame.style.removeProperty('width');
    frame.style.removeProperty('top');
    frame.style.removeProperty('--frame-bg');
    frame.style.removeProperty('--frame-outline');
    cta.style.opacity = '0';
    frame.dataset.cta = 'false';
    return;
  }

  const ink = rgb(INK[closer.dataset.ink]);
  const fill = ink.map((v, i) => Math.round(v + (GREEN[i] - v) * t));

  /* On every other section the frame sits on the content's optical centre, which the
     header pushes below the middle of the screen. As the button, it belongs on the
     screen's own centre — so the last thing the morph does is take that offset out. */
  const centre = window.innerHeight / 2;

  frame.style.top = `${frameTop + (centre - frameTop) * t}px`;
  frame.style.width = `${frameWidth + (CTA_WIDTH - frameWidth) * t}px`;
  frame.style.setProperty('--frame-bg', `rgba(${fill.join(', ')}, ${0.06 + 0.94 * t})`);
  frame.style.setProperty('--frame-outline', `rgba(${ink.join(', ')}, ${0.25 * (1 - t)})`);
  cta.style.opacity = String(t);
  frame.dataset.cta = String(t > 0.99);
}

ScrollTrigger.create({
  trigger: closer,
  start: 'top bottom',
  end: 'top top',
  /* Re-measure the frame's natural width after a resize, with the inline one cleared —
     it comes from --frame-w, which is viewport-dependent. */
  onRefresh: () => {
    frame.style.removeProperty('width');
    frame.style.removeProperty('top');
    frameWidth = frame.getBoundingClientRect().width;
    frameTop = parseFloat(getComputedStyle(frame).top);
  },
  onUpdate: (self) => morph(self.progress),
});

/* The photograph drifts against the scroll — slower than the text, so it feels set
   further back and dissolves rather than leaves. Motion only, so it goes with the rest
   of the motion when the visitor asks for less. */
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  gsap.fromTo(
    photo,
    { y: 60 },
    {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: document.querySelector('[data-photo="true"]'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    }
  );
});

/* ---------- reveals ----------
   The trigger is the title, not the section: sections are a full viewport tall with
   their content centred, so anything anchored to the section fires while the content
   is still a screen below the fold and the animation is over before it comes into
   view. Skipped entirely when the visitor asked for less motion. */
const reveals = [];

gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  gsap.utils.toArray('.section').forEach((section) => {
    const targets = section.querySelectorAll(
      '.section__title, .section__subtitle, .btn'
    );

    reveals.push(
      gsap.from(targets, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: section.querySelector('.section__title'),
          start: 'top 90%',
          once: true,
        },
      })
    );
  });
});

/* A reload part-way down the page, or a deep link like /#customization, opens below
   most of these triggers. Two things go wrong without this pass: every scrubbed value
   stays at its CSS default until the first scroll (the ground would stay the hero's
   and the photograph invisible), and any reveal the page opened below never fires, so
   its text is left sitting at opacity 0 — permanently, since it only fires `once`. */
ScrollTrigger.refresh();
ScrollTrigger.update();

/* Any reveal the page is already past must render finished rather than sit at its
   from-state. ScrollTrigger does not fire `onEnter` for a trigger that is jumped over in
   one step — on load, on a deep link, or on a scroll long enough to clear a whole
   section — and because these fire `once` they would never fire at all. Run the sweep
   on load, on every refresh, and on each section change. */
function catchUpReveals() {
  reveals.forEach((tween) => {
    const trigger = tween.scrollTrigger;
    if (trigger && window.scrollY > trigger.start && tween.progress() === 0) {
      tween.progress(1);
    }
  });
}

catchUpReveals();
ScrollTrigger.addEventListener('refresh', catchUpReveals);
document.addEventListener('section:change', catchUpReveals);
