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
  green: token('--c-green'),   /* no section takes it since the hero went graphite */
  graphite: token('--c-graphite'),
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

/* ---------- the hero morph ----------
   The hero's green leaves as a shape rather than a cross-fade: a full-bleed layer that
   shrinks, across the one crossing into capabilities, to exactly the frame's box and
   stops there. It does not dissolve — it stays behind the frame and the opaque dashboard
   arrives on top of it (client, 2026-09-03).

   Three things follow from "exactly the frame's box":
     - the target rect is measured off the frame itself, so the two can never drift when
       --frame-w, the header height or the page padding change,
     - the radius is measured too, so the panel lands on the same 32 as everything else
       rounded on the page,
     - the shape is a clip-path, so the corners stay true instead of being squashed by a
       scale, and nothing is laid out again per frame.

   The panel is hidden past capabilities. It is invisible there anyway — the dashboard
   covers the box — but the next section's slide is empty, and a green box would show
   through it. */

const morph = document.querySelector('.stage-morph');
const MORPH = { from: grounds[0], to: grounds[1] };

let morphBox = null;

/* The frame's top is written inline by the exit further down, so it is cleared for the
   measurement and put back: this can be called from a refresh at any scroll position,
   while the natural top is the only one the panel should aim at. */
function measureMorph() {
  const saved = frame.style.top;
  frame.style.removeProperty('top');

  const box = frame.getBoundingClientRect();
  morphBox = {
    top: box.top,
    right: window.innerWidth - box.right,
    bottom: window.innerHeight - box.bottom,
    left: box.left,
    radius: parseFloat(getComputedStyle(frame).borderRadius),
  };

  if (saved) frame.style.top = saved;
}

/* t = 0 full-bleed and square, t = 1 the frame's box with the frame's radius. */
function drawMorph(t) {
  const b = morphBox;
  morph.style.clipPath =
    `inset(${b.top * t}px ${b.right * t}px ${b.bottom * t}px ${b.left * t}px` +
    ` round ${b.radius * t}px)`;
}

/* One rule, used by the crossing and by the settle alike: the panel is drawn across the
   whole crossing and **gone** the moment it has landed. Being merely covered is not
   enough on capabilities — the tab strip cross-fades its panes, and a pane at half
   opacity let the green show through (client, 2026-09-03). Dropping it at t = 1 cannot
   be seen: the dashboard covers the box exactly at that point. */
function setMorph(t) {
  drawMorph(t);
  morph.hidden = t >= 1;
}

measureMorph();

grounds.forEach((ground, i) => {
  if (i === 0) return;

  const previous = grounds[i - 1];
  const from = coloursOf(previous);
  const to = coloursOf(ground);
  const leaving = slideFor(previous.id);
  const entering = slideFor(ground.id);

  /* The hero's ground does not fade into the next one — the shrinking panel carries the
     green away instead — so across that one crossing the ground goes smoky on the first
     movement rather than over the gesture. The step is invisible: at t = 0 the panel
     still covers the screen. The ink is dark on both sections, so only the ground is
     special-cased. */
  const shrinking = previous === MORPH.from && ground === MORPH.to;

  /* t = 0 is the previous section fully in place, t = 1 this one fully in place. */
  const apply = (t) => {
    paint(
      mix(from.ground, to.ground, shrinking ? (t > 0 ? 1 : 0) : t),
      mix(from.ink, to.ink, t),
      mix(from.counter, to.counter, t)
    );
    photo.style.opacity = String(from.photo + (to.photo - from.photo) * t);
    stage(leaving, 1 - t);
    stage(entering, t);

    if (shrinking) setMorph(t);

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

/* The morph is scrubbed like everything else, so it carries the same trap: a jump that
   clears the whole crossing in one step fires no update. Settle it from geometry — on
   load, on every refresh, and on each section change. The crossing's range is exactly
   one viewport, hero's top to capabilities' top, the same range the trigger uses. */
function settleMorph() {
  const start = MORPH.from.offsetTop;
  const end = MORPH.to.offsetTop;

  setMorph(gsap.utils.clamp(0, 1, (window.scrollY - start) / (end - start)));
}

settleMorph();
ScrollTrigger.addEventListener('refresh', () => {
  measureMorph();
  settleMorph();
});
document.addEventListener('section:change', settleMorph);

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
   the two behind it smaller, lower and dimmed. Thrown by hand only — the client asked for
   no timer and no buttons here, unlike the tabs above. A card that clears the catch
   distance, or is flicked fast enough over a shorter one, is let go of; it rejoins the
   deck at the back, so the deck never runs out. One that does not falls back into place.

   JS owns the cards' transforms outright (`base.css` sets none), because a card being
   dragged has to be moved from the same place its resting position comes from.

   **Movement is integrated, not tweened; only the dissolve is a fixed animation.** Two
   earlier cuts were wrong, both caught by the client on 2026-09-03:

     1. `power2.in` on the way out — an ease that starts from a standstill, so a card
        dragged aside and released stopped under the hand and then accelerated sideways on
        its own. "Антифизично".
     2. Then an ease-*out* whose duration came from the release speed. No acceleration, but
        a tween has to cover the whole distance out of the frame in its allotted time, so a
        slow release still handed off to an exit faster than the hand.

   Both come from making the card's *travel* the thing that has to finish. It does not: what
   has to finish is the card leaving the deck, and that is the dissolve. So the position is
   integrated per frame from the release velocity against exponential friction and is never
   told where to end up, while the opacity runs a fixed 0.42s regardless of how far the card
   gets. Let go of a card at rest off to one side and it dissolves where it stands; flick it
   and it is most of a screen away by the time it goes. His call, in his words: "если я увел
   карточку и оставил сбоку — она на месте растворится. если я выкинул её драгом — улетит
   растворяясь." */

const deck = document.querySelector('.style-deck');

if (deck) {
  const cards = gsap.utils.toArray('.style-card', deck);

  const DECK = {
    /* Shrinking a card also pulls its bottom edge up — 8px at this size — so the drop has
       to beat that before anything peeks out at all. 28 leaves 20px of the second card
       showing under the front one and 40 of the third. */
    drop: 28,       /* px each card behind sits lower than the one in front */
    shrink: 0.05,   /* and this much smaller */
    /* The shading of the cards behind is an overlay, not their opacity — see
       `.style-card::after`. This is only the switch: 0 on the front card, 1 behind it. */
    veil: 1,
    hint: 18,       /* px the front card is pulled each way on arrival, as a "drag me" */
    wait: 0.35,     /* s before that starts, so it does not collide with the section landing */
    catch: 0.26,    /* how much of the frame's width a slow drag must cover to let go */
    flick: 0.7,     /* px/ms — past this the card goes even if the drag was short */
    swing: 12,      /* deg the front card turns across a full-width drag — in flight the
                       same mapping keeps turning it, so the spin costs nothing */
    lead: 0.6,      /* how far the next card comes up while the front one is dragged */
    /* Friction, as the time constant of `v *= e^(-dt/tau)`. A card carries roughly
       `v0 × tau × (1 - e^(-dissolve/tau))` px past the release point: at 190ms and a 0.42s
       dissolve that is ~170px per px/ms of release speed. Lower it and throws stop short;
       raise it and a nudge sails across the frame. */
    tau: 190,
    dissolve: 0.42, /* s, fixed — the one thing that decides when a card is gone */
    close: 0.4,     /* s for the deck to close up behind it */
    fall: 0.5,      /* s for an undecided card to drop back into place */
  };

  /* Front to back. A card that is let go of moves to the end of this straight away, so the
     deck can start closing up while it is still dissolving on top. */
  let order = cards.slice();
  let flight = null;
  let drag = null;
  let hint = null;

  /* The arrival hint is decoration — it goes when the visitor asks for less motion. The
     drag itself stays: it is the content, not an effect. */
  const stillness = window.matchMedia('(prefers-reduced-motion: reduce)');

  const slot = (i) => ({
    x: 0,
    y: i * DECK.drop,
    scale: 1 - i * DECK.shrink,
    rotation: 0,
    /* Full opacity at rest, always: a card only loses it on the way out. */
    opacity: 1,
    '--veil': i === 0 ? 0 : DECK.veil,
  });

  const mix = (from, to, t) => from + (to - from) * t;

  function layout({ duration = 0, ease = 'power2.out' } = {}) {
    order.forEach((card, i) => {
      /* The one in the air owns its position, its opacity and its place in the pile until
         it lands — it has to dissolve over the deck, not under it. */
      if (flight && flight.card === card) return;

      card.dataset.top = String(i === 0);
      /* Stacking order cannot be interpolated — it is set, never tweened. */
      gsap.set(card, { zIndex: order.length - i });

      const to = slot(i);
      if (duration) gsap.to(card, { ...to, duration, ease, overwrite: true });
      else gsap.set(card, to);
    });
  }

  /* The card behind rises towards the front slot as the front one is pulled away, and sinks
     back if it returns. It is what makes the drag feel answered before it is finished. */
  function lead(progress) {
    const next = order[1];
    if (!next) return;

    const near = slot(0);
    const home = slot(1);
    const t = Math.min(1, progress) * DECK.lead;

    gsap.set(next, {
      y: mix(home.y, near.y, t),
      scale: mix(home.scale, near.scale, t),
      '--veil': mix(home['--veil'], near['--veil'], t),
    });
  }

  /* Nothing on the page says the front card can be taken, so on arrival it takes itself a
     little way each way and settles — the client's ask, 2026-09-03: "при заходе на слайд
     активная картинка должна показать что её можно двигать — должна дернуться влево и
     вправо". It runs on every arrival, not once per page: the visitor may reach this screen
     for the first time on the way back up. It turns as it goes, on the drag's own mapping,
     so it is the same gesture the hand would make and not a slide. */
  function nudge() {
    hint?.kill();
    hint = null;

    if (stillness.matches || flight || drag) return;

    const card = order[0];
    const turn = (x) => (x / deck.clientWidth) * DECK.swing;

    hint = gsap
      .timeline({ delay: DECK.wait, defaults: { ease: 'power2.inOut' } })
      .to(card, { x: -DECK.hint, rotation: turn(-DECK.hint), duration: 0.3 })
      .to(card, { x: DECK.hint, rotation: turn(DECK.hint), duration: 0.45 })
      .to(card, { x: 0, rotation: 0, duration: 0.35 });
  }

  function land() {
    if (!flight) return;

    const { card, step } = flight;
    gsap.ticker.remove(step);
    flight = null;

    /* Back of the deck, still invisible, then faded up into its slot. Sliding it back
       across the frame would read as the card returning. */
    const i = order.indexOf(card);
    const home = slot(i);
    gsap.set(card, { ...home, zIndex: order.length - i, opacity: 0 });
    gsap.to(card, { opacity: home.opacity, duration: DECK.close, ease: 'power1.out' });
  }

  function toss(card, vx, vy) {
    /* Out of the deck's order immediately: the cards behind start closing up while this one
       is still in the air. */
    order = order.filter((c) => c !== card).concat(card);

    let x = Number(gsap.getProperty(card, 'x'));
    let y = Number(gsap.getProperty(card, 'y'));
    let sx = vx;
    let sy = vy;

    /* Nothing here is told where to stop. The card keeps the speed the hand gave it and
       loses it to friction, which is the whole point. */
    const step = (time, dt) => {
      const decay = Math.exp(-dt / DECK.tau);
      sx *= decay;
      sy *= decay;
      x += sx * dt;
      y += sy * dt;
      gsap.set(card, { x, y, rotation: (x / deck.clientWidth) * DECK.swing });
    };

    flight = { card, step };
    card.dataset.top = 'false';
    gsap.set(card, { zIndex: cards.length + 1 });
    gsap.ticker.add(step);
    layout({ duration: DECK.close });

    /* Fixed length, whatever the card is doing — this is what decides it is gone. */
    gsap.to(card, {
      opacity: 0,
      duration: DECK.dissolve,
      ease: 'power1.in',
      onComplete: land,
    });
  }

  function stopDrag() {
    if (!drag) return;
    drag.card.removeAttribute('data-drag');
    drag = null;
  }

  deck.addEventListener('pointerdown', (e) => {
    if (flight || drag) return;

    const card = order[0];
    if (e.target !== card) return;

    card.setPointerCapture(e.pointerId);
    card.dataset.drag = 'true';
    hint?.kill();
    hint = null;
    gsap.killTweensOf(card);

    drag = {
      card,
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      dx: 0,
      /* Last sample and a smoothed speed, px/ms. One raw frame is far too jumpy to throw
         a card with — a stalled finger can still report a 20px jump. */
      lastX: e.clientX,
      lastY: e.clientY,
      lastAt: e.timeStamp,
      vx: 0,
      vy: 0,
    };
  });

  deck.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;

    const gap = Math.max(1, e.timeStamp - drag.lastAt);
    /* Exponential average: enough of the last frames to survive one bad sample, short
       enough that letting go after a pause reads as letting go, not as a throw. */
    drag.vx = mix(drag.vx, (e.clientX - drag.lastX) / gap, 0.7);
    drag.vy = mix(drag.vy, (e.clientY - drag.lastY) / gap, 0.7);
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    drag.lastAt = e.timeStamp;
    drag.dx = e.clientX - drag.x;

    gsap.set(drag.card, {
      x: drag.dx,
      y: e.clientY - drag.y,
      rotation: (drag.dx / deck.clientWidth) * DECK.swing,
    });

    lead(Math.abs(drag.dx) / (deck.clientWidth * DECK.catch));
  });

  const release = (e) => {
    if (!drag || e.pointerId !== drag.id) return;

    const { card, dx, vx, vy } = drag;
    /* Either far enough, or fast enough in the direction it is already going. A flick that
       covers 40px and stops is not a throw; one that covers 40px and is still moving is. */
    const far = Math.abs(dx) > deck.clientWidth * DECK.catch;
    const fast = Math.abs(vx) > DECK.flick && Math.sign(vx) === Math.sign(dx) && dx !== 0;

    stopDrag();

    if (far || fast) toss(card, vx, vy);
    /* Everything goes home together — the card, and the one that came up behind it. */
    else layout({ duration: DECK.fall, ease: 'power3.out' });
  };

  deck.addEventListener('pointerup', release);
  deck.addEventListener('pointercancel', release);

  /* Same gate as the tabs, and for the same reason: a slide at opacity 0 still hit-tests,
     and a card must not be draggable from behind another section. A crossing that starts
     mid-drag, or mid-flight, puts every card back where it belongs rather than leaving one
     hanging half-dissolved. */
  const deckSlide = deck.closest('.stage-frame__slide');
  let live = null;

  const gate = (t) => {
    const onStage = Number(t) > 0.99;
    if (onStage === live) return;
    live = onStage;

    deck.inert = !onStage;

    if (onStage) {
      nudge();
      return;
    }

    stopDrag();
    hint?.kill();
    hint = null;
    if (flight) {
      gsap.ticker.remove(flight.step);
      flight = null;
    }
    gsap.killTweensOf(cards);
    layout();
  };

  gates.set(deckSlide, gate);
  layout();
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
