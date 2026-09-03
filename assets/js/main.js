/* Motion for the landing demo.
   Native page scroll, snapped section by section in CSS, and no smooth-scroll library.
   The wheel is the one input this file takes over — see `one gesture, one section` at
   the bottom for why the browser's own snapping could not be left to handle it. The
   effect copied from cash.app is the one that matters: the frame in the middle stays put
   while the two text columns scroll past it, and what the frame holds changes as the
   section changes.
     1. the ground colour, the ink and the frame's slides are all interpolated against
        the same scroll, so a section change lands as one movement,
     2. the frame leaves upward on the one section that has none,
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

/* Two slides hold interactive content — the capabilities tabs and the style deck — so each
   has to know how far on stage it is: its controls must not take clicks or focus from
   behind another section. `stage()` is the single writer of `--t`, so the gates hang off it
   and are right in every path: a crossing, a jump, a deep link, a refresh. Each controller
   registers its own below. */
const gates = new Map();

function stage(slide, t) {
  if (!slide) return;
  slide.style.setProperty('--t', String(t));
  gates.get(slide)?.(t);
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
   pill takes a dark grey sweep over DWELL seconds — the sweep *is* the progress bar for the
   timer, so the two cannot drift: the same tween moves `--p` and, on completion, advances
   the pane.

   Click and it goes manual for the rest of the page's life: the timer never runs again, so
   the chosen pill just sits there as plain ink. The client asked for exactly that — "до
   перезагрузки".

   Nothing runs while the slide is off stage. The strip is also made `inert` there, because
   the slide's opacity of 0 still hit-tests. */

const DWELL = 5;   /* seconds, the client's number — mirrored by --tab-dwell in the CSS */
const tabStrip = document.querySelector('.frame-tabs');

if (tabStrip) {
  const tabs = gsap.utils.toArray('.frame-tab', tabStrip);
  const panes = gsap.utils.toArray('.frame-pane');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let index = 0;
  /* A visitor who asked for less motion starts in manual mode: no carousel, no sweep. */
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
      tab.setAttribute('aria-selected', String(n === index));
      /* --p is the timer's own position and nothing else: 0% leaves the active pill plain
         ink, which is exactly the resting state in manual mode. */
      tab.style.setProperty('--p', '0%');
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

  /* Driven by the slide's own `--t`, not by `section:change`: `--t` is written on every
     path — crossing, jump, deep link, refresh — while a discrete toggle can be missed.
     Only the edges matter, or a crossing's last frames would restart the sweep. */
  const tabsSlide = tabStrip.closest('.stage-frame__slide');
  let live = null;

  const gate = (t) => {
    const onStage = Number(t) > 0.99;
    if (onStage === live) return;
    live = onStage;

    tabStrip.inert = !onStage;
    if (onStage) runTimer();
    else stopTimer();
  };

  gates.set(tabsSlide, gate);
  show(0);
  gate(currentSection().id === 'capabilities' ? 1 : 0);
}

/* ---------- the hero video ----------
   A silent screen recording on a loop. It autoplays from the markup, so it runs with no JS
   at all; JS only ever stops it — off stage, because there is no reason to decode frames
   nobody is looking at, and outright for a visitor who asked for less motion, who then
   keeps the poster. */

const heroVideo = document.querySelector('.stage-frame__video');

if (heroVideo) {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still) heroVideo.pause();

  const heroSlide = heroVideo.closest('.stage-frame__slide');
  let playing = null;

  /* Same edge-triggered shape as the tabs: `--t` is written on every frame of a crossing,
     and there is nothing to gain from calling play() sixty times a second. */
  const gate = (t) => {
    if (still) return;
    const onStage = Number(t) > 0.99;
    if (onStage === playing) return;
    playing = onStage;

    if (onStage) heroVideo.play().catch(() => {});
    else heroVideo.pause();
  };

  gates.set(heroSlide, gate);
  gate(currentSection().id === 'hero' ? 1 : 0);
}

/* ---------- the style deck ----------
   Tinder, in the frame: three store screens, the front one filling the frame exactly and
   the rest fanned out behind it. Thrown by hand only — the client asked for no timer and
   no buttons here, unlike the tabs above. A card that clears the catch distance flies out
   and rejoins the deck at the back, so the deck never runs out; one that does not falls
   back into place.

   JS owns the cards' transforms outright (`base.css` sets none), because a card being
   dragged has to be moved from the same place its resting position comes from. */

const deck = document.querySelector('.style-deck');

if (deck) {
  const cards = gsap.utils.toArray('.style-card', deck);

  const DECK = {
    drop: 10,       /* px each card sits below the one in front of it */
    shrink: 0.015,  /* how much smaller each card behind is */
    tilt: 3.2,      /* deg, to alternating sides — a deck, not a ladder */
    catch: 0.28,    /* how much of the frame's width a drag must cover to throw the card */
    swing: 14,      /* deg the front card turns across a full-width drag */
    close: 0.35,    /* s for the deck to close up behind a card that left */
    fly: 0.45,      /* s for a thrown card to clear the frame */
    fall: 0.4,      /* s for an undecided card to drop back into place */
  };

  /* Front to back. A thrown card moves to the end of this and the fan is re-read from it,
     so the deck's order is the only state here. */
  let order = cards.slice();
  let flying = false;
  let drag = null;

  const slot = (i) => ({
    x: 0,
    y: i * DECK.drop,
    rotation: i === 0 ? 0 : i % 2 ? DECK.tilt : -DECK.tilt,
    scale: 1 - i * DECK.shrink,
  });

  function layout(animate) {
    order.forEach((card, i) => {
      card.dataset.top = String(i === 0);
      /* Stacking order cannot be interpolated — it is set, never tweened. */
      gsap.set(card, { zIndex: order.length - i });

      const to = { ...slot(i), opacity: 1 };
      if (animate) gsap.to(card, { ...to, duration: DECK.close, ease: 'power2.out', overwrite: true });
      else gsap.set(card, to);
    });
  }

  function fly(card, direction) {
    flying = true;

    gsap.to(card, {
      x: direction * deck.clientWidth * 1.35,
      y: '+=60',
      rotation: direction * 26,
      opacity: 0,
      duration: DECK.fly,
      ease: 'power2.in',
      overwrite: true,
      onComplete: () => {
        order.push(order.shift());
        /* Put it straight into the back slot, invisible; `layout` fades it in there while
           the rest of the deck closes up. Sliding it back across the frame would read as
           the card returning. */
        gsap.set(card, { ...slot(order.length - 1), opacity: 0 });
        layout(true);
        flying = false;
      },
    });
  }

  function stopDrag() {
    if (!drag) return;
    drag.card.removeAttribute('data-drag');
    drag = null;
  }

  deck.addEventListener('pointerdown', (e) => {
    if (flying || drag) return;

    const card = order[0];
    if (e.target !== card) return;

    card.setPointerCapture(e.pointerId);
    card.dataset.drag = 'true';
    gsap.killTweensOf(card);
    drag = { card, id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0 };
  });

  deck.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;

    drag.dx = e.clientX - drag.x;

    gsap.set(drag.card, {
      x: drag.dx,
      y: e.clientY - drag.y,
      rotation: (drag.dx / deck.clientWidth) * DECK.swing,
    });
  });

  const release = (e) => {
    if (!drag || e.pointerId !== drag.id) return;

    const { card, dx } = drag;
    stopDrag();

    if (Math.abs(dx) > deck.clientWidth * DECK.catch) fly(card, Math.sign(dx));
    else gsap.to(card, { ...slot(0), duration: DECK.fall, ease: 'power2.out', overwrite: true });
  };

  deck.addEventListener('pointerup', release);
  deck.addEventListener('pointercancel', release);

  /* Same gate as the tabs, and for the same reason: a slide at opacity 0 still hit-tests,
     and a card must not be draggable from behind another section. A crossing that starts
     mid-drag drops the card where it belongs rather than leaving it hanging. */
  const deckSlide = deck.closest('.stage-frame__slide');
  let live = null;

  const gate = (t) => {
    const onStage = Number(t) > 0.99;
    if (onStage === live) return;
    live = onStage;

    deck.inert = !onStage;

    if (!onStage) {
      stopDrag();
      gsap.killTweensOf(cards);
      flying = false;
      layout(false);
    }
  };

  gates.set(deckSlide, gate);
  layout(false);
  /* A reload or a deep link can open on any section, so the first state comes from
     geometry — the same way the tabs get theirs. */
  gate(currentSection().id === 'customization' ? 1 : 0);
}

/* One section has no frame: the cases grid fills the screen on its own. Rather than fade
   the frame out there, it leaves the way everything else does — upward, at exactly the
   speed of the section it belonged to, so it reads as part of that screen departing. It
   does not come back: the closer draws its own call to action.

   (It used to shrink into that button. The client detached the two while he redraws the
   footer — do not re-couple them without asking.) */
const frameless = document.querySelector('[data-frame="none"]');
const setFrameTop = (px) => { frame.style.top = `${px}px`; };
let frameTop = 0;

const exitTrigger = ScrollTrigger.create({
  trigger: frameless,
  start: 'top bottom',
  end: 'top top',
  /* Re-measure the frame's natural position after a resize, with the inline one cleared:
     it comes from viewport-dependent custom properties. */
  onRefresh: (self) => {
    frame.style.removeProperty('top');
    frameTop = parseFloat(getComputedStyle(frame).top);
    setFrameTop(frameTop - self.progress * window.innerHeight);
  },
  onUpdate: (self) => setFrameTop(frameTop - self.progress * window.innerHeight),
  onLeave: () => setFrameTop(frameTop - window.innerHeight),
  onLeaveBack: () => setFrameTop(frameTop),
});

/* The exit is scrubbed, so a jump that clears the whole range fires nothing — the same
   trap the slides have. Settle it from the trigger's own progress on load, on refresh and
   on every section change. */
function settleFrame() {
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

/* ---------- one gesture, one section ----------
   The wheel no longer reaches the browser's own snapping. CSS snapping stays on and still
   owns the keyboard, touch and the scrollbar; this owns the wheel, and both land on the
   same points, so nothing here is a second source of truth about where a section starts.

   Why it had to be taken over. The trackpad produces a stream of small deltas that adds up
   to most of a screen inside one gesture, so mandatory snapping resolves it forwards and
   feels right. A mouse wheel produces one ~100px tick per click — well under half a 720px
   screen — and Chrome then snaps to the *nearest* point, which is the one the click started
   from. So a click moved nothing and, with `scroll-behavior: smooth` animating the round
   trip, moved nothing slowly. Client's words on 2026-09-03: "один клик не двигает",
   "вязко доезжает". cash.app has the same answer: measured the same day, its stylesheets
   contain no `scroll-snap` at all — the wheel and the trackpad are two delta sources
   feeding one animation of their own.

   The three numbers below are the whole feel of it; they are the only things to tune. */

const WHEEL = {
  trip: 12,     /* px of accumulated delta that counts as a gesture — one wheel click is
                   ~100px and the trackpad reaches it in two or three events, so both
                   answer on the first movement */
  rearm: 90,    /* ms of silence before the next gesture is allowed */
  glide: 0.65,  /* s to cross one section */
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* A section taller than the viewport holds content that can only be reached by scrolling
   inside it, so the controller stands down there rather than trap it. The design keeps
   every section exactly one viewport tall — this is a guard, not a mode. */
const oneScreenEach = () =>
  grounds.every((s) => s.getBoundingClientRect().height <= window.innerHeight + 1);

let wheelOwned = oneScreenEach();

/* deltaMode: 0 px, 1 lines, 2 pages. Firefox reports lines. */
const pixelsOf = (e) =>
  e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;

let travel = 0;
let locked = false;
let rearmTimer = null;

/* Every event arriving while the door is shut pushes the countdown out, so one burst is one
   gesture however long it runs. That is what drops the trackpad's inertia tail, which keeps
   firing for hundreds of milliseconds after the fingers lift, and what keeps a hard spin of
   the wheel from flying through three sections. */
function holdLock() {
  clearTimeout(rearmTimer);
  rearmTimer = setTimeout(() => {
    locked = false;
    travel = 0;
  }, WHEEL.rearm);
}

function nearestIndex() {
  let best = 0;
  grounds.forEach((section, i) => {
    const closer = Math.abs(section.offsetTop - window.scrollY);
    if (closer < Math.abs(grounds[best].offsetTop - window.scrollY)) best = i;
  });
  return best;
}

function glide(direction) {
  const next = Math.min(Math.max(nearestIndex() + direction, 0), grounds.length - 1);
  const to = grounds[next].offsetTop;
  const from = window.scrollY;

  locked = true;

  if (to === from) {
    holdLock();
    return;
  }

  /* Mandatory snapping re-resolves *any* scroll position written from script — measured on
     this page: `scrollBy(0, 60)` from the top lands on 720 immediately — so the movement
     can only be animated with snapping off. It goes back on at the end, where the page is
     already on an exact snap point and restoring it therefore moves nothing. */
  root.style.scrollSnapType = 'none';

  const at = { y: from };

  gsap.to(at, {
    y: to,
    duration: reducedMotion.matches ? 0 : WHEEL.glide,
    ease: 'power2.inOut',
    /* `behavior: instant` and not the stylesheet's `scroll-behavior: smooth`, which is
       still there for the logo's `#hero` link and would put a second animation on top. */
    onUpdate: () => window.scrollTo({ top: at.y, behavior: 'instant' }),
    onComplete: () => {
      window.scrollTo({ top: to, behavior: 'instant' });
      root.style.removeProperty('scroll-snap-type');
      holdLock();
    },
  });
}

window.addEventListener(
  'wheel',
  (e) => {
    if (!wheelOwned) return;
    if (e.ctrlKey) return;                                /* pinch zoom */
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;  /* a sideways gesture is not ours */

    e.preventDefault();

    if (locked) {
      holdLock();
      return;
    }

    travel += pixelsOf(e);
    if (Math.abs(travel) < WHEEL.trip) return;

    const direction = Math.sign(travel);
    travel = 0;
    glide(direction);
  },
  { passive: false }
);

ScrollTrigger.addEventListener('refresh', () => { wheelOwned = oneScreenEach(); });
