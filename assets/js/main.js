/* Motion for the landing demo.
   Native page scroll, snapped section by section in CSS. No wheel hijacking and no
   smooth-scroll library. The effect copied from cash.app is the one that matters:
   the frame in the middle stays put while the two text columns scroll past it, and
   what the frame holds changes as the section changes.
     1. the ground colour, the ink and the frame's slides are all interpolated against
        the same scroll, so a section change lands as one movement,
     2. the frame becomes the closing call to action,
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

/* ---------- the section boundary ----------
   One trigger per boundary owns *everything* a section change drives, and it is scrubbed
   by the scroll rather than switched at a line and then transitioned. A CSS transition
   read as lag: it could only start once the boundary had passed the header, by which
   point the section had almost arrived, and the fade then ran on after it landed — the
   colour finished while the picture was still a wall-clock fade behind.

   Anything else that has to move with a section change belongs here, not on a transition
   of its own. Two ways in, both already synchronised:

     - CSS: each slide carries `--t`, 0 fully off stage, 1 fully on. Read it from anything
       inside that slide — `translate: calc((1 - var(--t)) * 40px)` and the like. Slide
       children are not clipped, so they can leave the frame.
     - JS: a `section:scrub` event on `document` for every step of every crossing:

         document.addEventListener('section:scrub', (e) => {
           e.detail; // { from, to, t } — the two section elements and 0..1
         }); */

const slideFor = (id) => slides.find((slide) => slide.dataset.for === id);

function stage(slide, t) {
  if (slide) slide.style.setProperty('--t', String(t));
}

grounds.forEach((ground, i) => {
  if (i === 0) return;

  const previous = grounds[i - 1];
  const from = coloursOf(previous);
  const to = coloursOf(ground);
  const leaving = slideFor(previous.id);
  const entering = slideFor(ground.id);

  /* t = 0 is the previous section fully in place, t = 1 this one fully in place. */
  const apply = (t) => {
    paint(
      mix(from.ground, to.ground, t),
      mix(from.ink, to.ink, t),
      mix(from.counter, to.counter, t)
    );
    photo.style.opacity = String(from.photo + (to.photo - from.photo) * t);
    stage(leaving, 1 - t);
    stage(entering, t);

    document.dispatchEvent(
      new CustomEvent('section:scrub', { detail: { from: previous, to: ground, t } })
    );
  };

  ScrollTrigger.create({
    trigger: ground,
    start: 'top bottom',
    end: 'top top',
    onUpdate: (self) => apply(self.progress),
    /* onUpdate only fires inside the range, and a jump can clear the whole range in one
       step, so the two ends are pinned explicitly. Without this a fast scroll can leave a
       slide stranded part-way lit. */
    onLeave: () => apply(1),
    onLeaveBack: () => apply(0),
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

/* The boundary triggers cover the crossings; at rest between them nothing is running, so
   the slides are set from geometry instead. Needed on load and on a deep link, which can
   open past every boundary, and after a refresh, which re-measures at rest. */
function currentSection() {
  let current = grounds[0];
  grounds.forEach((section) => {
    if (section.offsetTop <= window.scrollY + 1) current = section;
  });
  return current;
}

function settleSlides() {
  const current = currentSection();
  slides.forEach((slide) => stage(slide, slide.dataset.for === current.id ? 1 : 0));
}

settleSlides();

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

/* ---------- the capabilities tabs ----------
   Three panes in the capabilities slide, one strip of tabs under the frame. The tab label
   fills with green over DWELL seconds — the fill *is* the progress bar for the timer, so
   the two cannot drift: the same tween moves `--p` and, on completion, advances the pane.

   Click and it goes manual for the rest of the page's life: the timer never runs again and
   the chosen tab stays fully green. The client asked for exactly that — "до перезагрузки".

   Nothing runs while the slide is off stage. The strip is also made `inert` there, because
   the slide's opacity of 0 still hit-tests. */

const DWELL = 5;   /* seconds, the client's number — mirrored by --tab-dwell in the CSS */
const tabStrip = document.querySelector('.frame-tabs');

/* Assigned below when the strip exists; called again after the load-time refresh, once the
   resting section is actually known. */
let gateTabs = () => {};

if (tabStrip) {
  const tabs = gsap.utils.toArray('.frame-tab', tabStrip);
  const panes = gsap.utils.toArray('.frame-pane');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let index = 0;
  /* A visitor who asked for less motion starts in manual mode: no carousel, no fill. */
  let manual = reduced;
  let timer = null;

  function stopTimer() {
    if (timer) timer.kill();
    timer = null;
  }

  function show(next) {
    index = next;
    panes.forEach((pane, n) => {
      pane.dataset.active = String(n === index);
    });
    tabs.forEach((tab, n) => {
      const on = n === index;
      tab.setAttribute('aria-selected', String(on));
      /* Idle tabs sit at 0%. The active one is full green when the timer is not running,
         and swept from 0 to 100% by the tween when it is. */
      tab.style.setProperty('--p', on && manual ? '100%' : '0%');
    });
  }

  function runTimer() {
    stopTimer();
    if (manual) return;

    const tab = tabs[index];
    const sweep = { p: 0 };

    timer = gsap.to(sweep, {
      p: 100,
      duration: DWELL,
      ease: 'none',
      onUpdate: () => tab.style.setProperty('--p', `${sweep.p}%`),
      onComplete: () => {
        tab.style.setProperty('--p', '0%');
        show((index + 1) % tabs.length);
        runTimer();
      },
    });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      manual = true;
      stopTimer();
      tabs.forEach((other) => other.style.setProperty('--p', '0%'));
      show(i);
    });
  });

  /* On stage: run. Off stage: stop, and take the strip out of the tab order. */
  gateTabs = (id) => {
    const onStage = id === 'capabilities';
    tabStrip.inert = !onStage;
    if (onStage) runTimer();
    else stopTimer();
  };

  document.addEventListener('section:change', (e) => gateTabs(e.detail.id));

  show(0);
  gateTabs(currentSection().id);
}

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

/* One section has no frame: the cases grid fills the screen on its own. Rather than
   fade the frame out there, it leaves the way everything else does — upward, at exactly
   the speed of the section it belonged to, so it reads as part of that screen departing.
   It is parked a full viewport above until the closer brings it back down as the button.

   The two moves are adjacent ranges and share this parked position, so nothing jumps. */
const frameless = document.querySelector('[data-frame="none"]');
const parkedTop = () => frameTop - window.innerHeight;
const setFrameTop = (px) => { frame.style.top = `${px}px`; };

function morph(t) {
  if (t === 0) {
    frame.style.removeProperty('width');
    frame.style.removeProperty('--frame-bg');
    frame.style.removeProperty('--frame-outline');
    /* Not `removeProperty`: at this end of the range the frame is parked above the
       screen, where the cases section left it. */
    setFrameTop(parkedTop());
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
  const start = parkedTop();

  setFrameTop(start + (centre - start) * t);
  frame.style.width = `${frameWidth + (CTA_WIDTH - frameWidth) * t}px`;
  frame.style.setProperty('--frame-bg', `rgba(${fill.join(', ')}, ${0.06 + 0.94 * t})`);
  frame.style.setProperty('--frame-outline', `rgba(${ink.join(', ')}, ${0.25 * (1 - t)})`);
  cta.style.opacity = String(t);
  frame.dataset.cta = String(t > 0.99);
}

const morphTrigger = ScrollTrigger.create({
  trigger: closer,
  start: 'top bottom',
  end: 'top top',
  /* Re-measure the frame's natural size and position after a resize, with the inline
     ones cleared — both come from viewport-dependent custom properties. */
  onRefresh: () => {
    frame.style.removeProperty('width');
    frame.style.removeProperty('top');
    frameWidth = frame.getBoundingClientRect().width;
    frameTop = parseFloat(getComputedStyle(frame).top);
  },
  onUpdate: (self) => morph(self.progress),
  onLeave: () => morph(1),
  onLeaveBack: () => morph(0),
});

/* The frame's exit, on the boundary into the section that has none. */
const exitTrigger = ScrollTrigger.create({
  trigger: frameless,
  start: 'top bottom',
  end: 'top top',
  onRefresh: (self) => setFrameTop(frameTop - self.progress * window.innerHeight),
  onUpdate: (self) => setFrameTop(frameTop - self.progress * window.innerHeight),
  onLeave: () => setFrameTop(parkedTop()),
  onLeaveBack: () => setFrameTop(frameTop),
});

/* Both of the frame's moves are scrubbed, so at rest between them nothing has run and a
   jump can clear a whole range without firing anything — the same trap the slides have.
   Settle it from the two triggers' own progress on load, on refresh, and on every section
   change. Without this, scrolling from the closer back to the hero in one step left the
   frame parked above the screen for good. */
function settleFrame() {
  if (morphTrigger.progress > 0) {
    morph(morphTrigger.progress);
    return;
  }

  morph(0);
  setFrameTop(frameTop - exitTrigger.progress * window.innerHeight);
}

settleFrame();
ScrollTrigger.addEventListener('refresh', settleFrame);
document.addEventListener('section:change', settleFrame);

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
      '.section__title, .section__subtitle, .btn, .case'
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
settleSlides();
/* A deep link can open straight on the capabilities section, past the trigger that would
   otherwise have started its timer. */
gateTabs(currentSection().id);
ScrollTrigger.addEventListener('refresh', settleSlides);

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
