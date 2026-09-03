# Alpha Seller — desktop landing demo

> This file is the single source of truth for the project. A session that has read only
> this file must be able to continue the work correctly.

## 0. Working agreement — read first

**Levon (designer, the person I work with) makes every decision. I write code and help him
think. I never decide for him.**

- Do not invent solutions on this project. Structure, color, copy, visual direction,
  motion — all of it is his call.
- When something is undefined: **ask**. Do not fill the gap with a reasonable default and
  move on. Offering options when he asks for them is fine; picking one unasked is not.
- This applies to product and design decisions, not to routine implementation detail.
- Levon is not the end client. Behind him: Alfa-Bank stakeholders and the board, who are
  the audience for this demo. When this file says "client decision", it means Levon's.

## 1. Product

**Alpha Seller** — a single platform for e-commerce, a sub-brand inside the Alfa-Bank
ecosystem. The product it is aiming at is **Shopify**. Closest Russian competitor:
**Yandex Kit**.

Site language: Russian. Tone of voice: informal "ты".

## 2. Purpose of this build

A **demo of the desktop homepage**, shown at a board meeting to earn a "go" for building
the real site.

- Pitch artifact, not production code: one page, desktop only, static content.
- Success = the board reads the tone (light, confident, colorful, animated) and approves.
- Nothing is wired up. Every link and button is a dead stub.

## 3. Reference

<https://cash.app/> — the client wants to copy it closely, but **the visual language is
what matters, not their content**. We do not copy their block topics; we copy how a block
is built and how the page moves.

What he explicitly liked:

1. **Section architecture** — headline on the left, a frame in the middle, the
   subtitle + CTA on the right. This three-part split is the signature move and the single
   most important thing to get right.
2. **The frame is not always UI.** On cash.app some frames hold video or people, not a
   product screen. Must be supported from the start.
3. Uniform rhythm: every section is a full-bleed colored panel with the same skeleton,
   same radii, same CTA pill.
4. Lightness: heavy whitespace, short copy, one idea per screen.
5. Color variety: each section owns a color; scrolling reads as a color sequence.
6. Motion: sticky minimal header, scroll-triggered reveals, parallax, hover states.

### The frame

- cash.app uses a phone-shaped frame. **Ours is not a phone** — rectangular, close to
  square, around **4:3**.
- **Left empty for now.** Build the narrative, the structure and all the code first; fill
  the frame with content later. Screens, video and people files come later.
- The supplied product screens are 1.42:1, so they will not fill a 4:3 frame exactly.
  Levon is aware and fine with it for now.

## 4. Page structure

Header + 7 sections + footer.

| # | Section | Background |
|---|---|---|
| 1 | Hero | Green `#A6ED00` |
| 2 | Key capabilities | Smoky white `#E9EBEE` |
| 3 | Speed | Smoky white `#E9EBEE` |
| 4 | Customization | Black `#000000` |
| 5 | Marketplaces | Smoky white `#E9EBEE` |
| 6 | Cases | Smoky white `#E9EBEE` — card grid, see below |
| 7 | Closer + footer | Black `#000000` — one screen, see below |

**Red is not used on this page at all** (for now). Both dark sections use pure `#000000`;
`#1A1817` is unused. Pure white is no longer a section ground either — the four light
sections are all smoky white, so the page reads green → smoke → smoke → black → smoke →
smoke → black.

### Copy — v1, from the client, 2026-09-02

Every section carries exactly three strings: title, subtitle, CTA label.
**Neither titles nor subtitles carry a trailing period** — the client removed them. A ⏎ in
the table is a hard `<br>` in the markup: the client sets those two titles' line breaks by
hand rather than leaving them to `text-wrap: balance`.

| # | Title | Subtitle | CTA |
|---|---|---|---|
| 1 | Одна платформа на всю онлайн-торговлю | Продавай больше, управляй с легкостью, расширяй аудиторию с единой платформой для управления электронной коммерцией | Начать бесплатно |
| 2 | Весь цикл ⏎ в одном кабинете | Свой сайт, приложение, аналитика, управление рекламой и логистикой, деньги, остатки и отзывы | — **dropped** |
| 3 | Твоё приложение ⏎ и интернет магазин ⏎ за один день | Онлайн-витрины без подрядчиков, с привязкой к Telegram и Max — рабочие, красивые и с твоей наценкой | Сделать сайт |
| 4 | Стиль магазина уникальный, как ты сам | Выбирай из стильных шаблонов и докручивай, пока не будет идеально подходить под твой вкус | Посмотреть шаблоны |
| 5 | Управляй своим бизнесом на маркетплейсах | Даём аналитику по заказам, остаткам, логистике и помогаем выбрать лучшие карточки товаров | Подключить |
| 6 | С нами работают самые смелые | *(unused — the cases layout has no subtitle column)* | Все кейсы |
| 7 | Продавай по своим правилам | Верни контроль над бизнесом и заставь его работать на твою мечту | Начать бесплатно |

- **Section 2 has no CTA.** `О платформе` was removed on 2026-09-02 once the frame got its
  tabs: the tabs are the thing to interact with there, and a second control next to them
  competed with the first.
- Sections 1 and 7 share the CTA `Начать бесплатно`, and the header carries it too. **This
  repetition is intentional** — do not "fix" it.
- Copy is v1 and will change. Keep every string in one place in the markup so swapping is
  cheap.

### Header

- Logo (Alpha Seller only — no Alfa-Bank lockup).
- Links: `Продукты`, `Тарифы`, `Крупному бизнесу`, `Примеры`, `Блог`.
- Button: `Начать бесплатно`.
- **Full-bleed**, not inside the page container: 16px from the top, 20px from both edges.
  The height follows from the padding plus the 52px controls; nothing fixes it — it lands
  at 88px. The bottom padding (20px) is still a placeholder.
- **The nav links sit on the screen's centre**, not in the middle of the space left over
  between the logo and the button. Implemented as a `1fr auto 1fr` grid.
- The ground is light but sections 1, 4 and 7 are green/black. **The navbar must recolor
  itself against the section currently under it** (or an equivalent solution). Real
  requirement — plan for it in the section markup.

### Cases

Section 6 is a card grid, after cash.app's stats block: the title and a `Все кейсы` button
at the top left, four equal cards along the bottom. The section keeps the smoky ground and the cards are
**white and square**, carrying their own colours rather than following `--ink`. The client's
screenshot showed the whole section black, but that was a layout reference, not a colour
decision.

The partner logos (`assets/logos/`, from Figma node `32:29061` — KINASH, Домодедово,
12 месяцев, M.Reason) ship **white on transparent**, and there is no dark version of the
source artwork. Three of them are therefore inverted in CSS (`[data-invert="true"]`) to sit
on a white card. M.Reason is not: it is dark lettering on its own white plate and already
reads correctly. Proper dark exports would be better than the filter.

The heading here is one of the two that carry the `xxl` size.

**The cards are as large as a 24px gap between them allows**, and always square. Their gap
is a flat 24 rather than `--col-gap`: the client wants them big, and the three-column gap has
nothing to do with this grid. Width comes from the grid, height from the ratio — nothing caps
the height, because a cap would take the square instead. Card sizes: 304 at 1440, 321 at
1512, 408 at 1920.

No subtitle column, so the subtitle that section used to have is currently unused.

**The frame does not appear here, and does not come back.** The section carries
`data-frame="none"`, and instead of fading out the frame *leaves* — upward, one viewport, at
exactly the speed of the section it belonged to, so it reads as part of that screen
departing. After that it stays parked above the screen for the rest of the page.

It used to come back down and shrink into the closer's green button. **The client detached
the two** while he redraws the footer — do not re-couple them without asking.

**The card copy is placeholder written by me**, at the client's request, four sentences in
the site's voice. Replace it with real cases before this goes anywhere near a customer.

### Closer + footer — one screen

The last section and the footer are a single 100vh block, not two. Title top-left under the
header, subtitle top-right, the footer's four columns along the bottom, and in the middle —
where the frame stands on every other section — the call to action.

Its heading carries `xxl`, and is allowed to run under the frame column
(`grid-column: 1 / 3`) — one text column is too narrow at that size.

**The middle of this screen is currently empty.** The frame used to travel back down and
shrink into a green `Начать бесплатно` button here; the client detached that while he
redraws the footer, so the middle grid row is a bare spacer and the section has no call to
action of its own. The closer's head gets 32px more air under the navbar than a normal
section's top padding gives.

This also removed a standing problem. The old footer was ~344px tall, so it could never
hold a snap point of its own and the closer could never centre itself before the page ran
out of scroll. Now the page is exactly 7 × 100vh and the closer is the last snap.

Footer element inventory, from Figma node `196:46921` — **inventory only, ignore its
styling**. No red panel, no pills.

- Column 1: `support@alfasell.com`, `© Альфа-Селлер, 2026`, plus social icons
  (Telegram, Instagram, VK, email).
- Column 2: `Продукты`, `Тарифы`, `Крупному бизнесу`, `Примеры`.
- Column 3: `Блог`, `База знаний`, `Реферальная программа`, `О компании`.
- Column 4: `Публичная оферта`, `Политика конфиденциальности`,
  `Согласие на обработку персональных данных`.

**Every link on the page is sentence case — capital first letter, lowercase rest.** The
header nav and all four footer columns; client asked for it on 2026-09-02 because the
lowercase nav next to the capitalised legal column read as two different systems. Only
`support@alfasell.com` is left alone — it is an address, not a label. Done in the markup,
not with `text-transform: capitalize`, which would upper-case every word and give
"Крупному Бизнесу".

## 5. Motion

**The frame stays, the text scrolls past it.** That is the effect the client wants, and it
is what cash.app actually does.

### What cash.app really does (verified 2026-09-02, second reading)

Its scroll container is described here as it stood that day; the third reading, on
2026-09-03, found a different DOM — see "The wheel is ours" below.

An earlier reading of the page was wrong — it was taken with the nav overlay open, which
locks the body and hides the machinery. Measured properly:

- `body { overflow: hidden }`; the document itself does not scroll.
- A component named `smooth-scroll-manager` is the scroller: `overflow: auto hidden`,
  `clientHeight` 900, `scrollHeight` 9745.
- Nine `homepage-scroll-section` elements, each exactly one viewport tall (900px).
- Section content is moved by JS transforms; the header is `position: sticky` and does not
  hide on scroll.

So: section-by-section, with a custom scroll container.

### Ours

Same visible result, built on **native page scroll** — no smooth-scroll library, nothing
pinned. The wheel is the one input we take over, and only to decide *when* a section
changes; see "The wheel is ours, everything else is the browser's" below.
`assets/js/main.js`, GSAP 3.15 + ScrollTrigger vendored in `assets/vendor/`:

1. **One frame for the whole page**, `position: fixed`, aligned with the middle grid column.
   The text columns scroll past it; it never moves. Each section keeps a
   `.section__frame-slot` that only holds the grid column open.
2. The frame holds one `.stage-frame__slide` per section, cross-faded as the section under
   the header changes (`--fade`, 0.9s — the one cross-fade left that is not tied to the
   scroll). Slides are empty until the client supplies screens, video and people.
3. **Two live colours drive the page: `--ground` and `--ink`, interpolated against the
   scroll.** Sections are transparent; `--ground` is what the page is painted with and
   `--ink` is everything drawn on it — text, the logo square, the frame's tint, the footer
   icons. JS lerps both between one section's pair and the next across the scroll from
   "next section's top at the viewport bottom" to "next section's top at the viewport top",
   which under snapping is exactly one gesture. The colour therefore finishes changing at
   the instant the section lands.

   Two earlier attempts were wrong and should not be retried: painting the colour on each
   section made it arrive as a hard edge sliding up the screen; moving it to `<body>` with
   a CSS `transition` read as lag, because the switch could only fire once the boundary had
   passed the header — by then the section had nearly arrived, and the fade ran on after it
   landed.

   Consequence: the logo mark and the footer social icons are **masked spans**, not
   `<img>`, so they can take `--ground` / `--ink` and stay in step. Their `url()`s live in
   the stylesheet, never in an inline `--icon`: a `url()` inside a custom property resolves
   against the sheet that *uses* it, so an inline one was fetched from
   `assets/css/assets/icons/…` and 404'd.
4. The frame fades out across the footer's entrance, scrubbed to the scroll.
5. Each section's title, subtitle and CTA reveal once on entry (rise 24px + fade, 0.8s,
   staggered). The trigger is the **title**, not the section — sections are a viewport tall
   with centred content, so a section-anchored trigger fires a full screen too early.
   Skipped under `prefers-reduced-motion: reduce`.

**The header does not hide on scroll** — tried, dropped at the client's request. It stays
put; only its ink changes. No custom cursor, no magnetic buttons.

### Section-by-section scrolling

The page snaps: it can never come to rest between two sections, and one gesture moves one
section. Three CSS declarations, no library:

```css
html     { scroll-snap-type: y mandatory; }
.section { scroll-snap-align: start; scroll-snap-stop: always; }
```

Every snap point is a section top, and the page is exactly 7 × 100vh, so the last section
is the last snap. (The footer used to need a bottom-edge snap of its own because it was
shorter than a screen; merging it into the closer removed that.)

**Lenis was considered and rejected.** Its `lenis/snap` addon does exist
(`type: proximity | mandatory | lock`), but Lenis replaces native scrolling wholesale and
by its own docs does not coexist with CSS scroll snapping. Not worth the dependency for
what native snapping does in three declarations. Do not re-litigate this without a new
reason.

#### The wheel is ours, everything else is the browser's

CSS snapping still owns the keyboard, touch and the scrollbar. It no longer owns the mouse
wheel — `main.js`, section `one gesture, one section`, takes `wheel` and animates one
section per gesture.

**Why it had to change.** The trackpad sends a stream of small deltas that add up to most
of a screen inside one gesture, so mandatory snapping resolves it forwards and feels right.
A mouse wheel sends one ~100px tick per click, far under half of a 900px screen, and Chrome
then snaps to the *nearest* point — the one the click started from. So a click moved
nothing, and `scroll-behavior: smooth` animated that round trip, which is what made it feel
gummy. Client on 2026-09-03, on a mouse: "один клик не двигает", "вязко доезжает". He chose
the unified controller over a wheel-only heuristic patch, so the trackpad now goes through
the same path.

**cash.app does the same thing, and no longer snaps at all** (measured 2026-09-03, third
reading, and this supersedes the second): `scroll-snap-type: none` on `html`, not one
element with `scroll-snap-align`, and **zero** occurrences of `scroll-snap` across all
seven of its stylesheets. `_scrollTop` / `_scrollLeft` sit on `window` — their own scroll
manager. The wheel and the trackpad are two delta sources feeding one animation of theirs.
(The `smooth-scroll-manager` element from the second reading is gone from their DOM. Their
layout could not be measured this time: the Browser pane was hidden, so `innerWidth` and
`innerHeight` were 0, and a `preventDefault` probe on `wheel` came back negative in that
state — inconclusive, not evidence that they leave the wheel alone.)

**Mandatory snapping re-resolves any scroll position written from script.** Measured on our
page: `scrollBy(0, 60)` from the top lands on 720 *immediately*, not on 60 —
`scroll-snap-stop: always` sends it to the next point in the direction of travel. So an
animation of the scroll position is impossible while snapping is on; the controller turns
`scroll-snap-type` off for the length of the glide and restores it at the end, where the
page is already on an exact snap point and restoring moves nothing. (Restoring it from a
position *between* points snaps to the nearest, not forwards: from 300 of 720 it went back
to 0.)

`scroll-behavior: smooth` stays in the stylesheet for the logo's `#hero` link; the
controller writes its own positions with `behavior: instant` so the two never stack.

**The three numbers are the whole feel**, in `WHEEL` at the bottom of `main.js`:
`trip` 12px of accumulated delta counts as a gesture (one wheel click is ~100px, the
trackpad reaches 12 in two or three events, so both answer on the first movement),
`rearm` 90ms of silence before the next gesture is allowed, `glide` 0.65s to cross one
section.

`rearm` is what drops the trackpad's inertia tail — it keeps firing for hundreds of
milliseconds after the fingers lift — and what keeps a hard spin of the wheel from flying
through three sections: every event arriving while the door is shut pushes the countdown
out, so one burst is one section however long it runs. The other side of that coin: holding
a continuous spin also moves exactly one section. If that ever reads as unresponsive, lower
`rearm` rather than touch the rest.

**The controller stands down on a section taller than the viewport** — such a section holds
content that can only be reached by scrolling inside it, and hijacking the wheel would trap
it. Re-checked on every `ScrollTrigger` refresh. The design keeps every section exactly one
viewport tall, so this is a guard, not a mode.

### The photographic ground

The customization section is backed by a photograph instead of a flat colour —
`assets/images/customization.webp`, from Figma node `201:56528`, 1858×2000, 75 KB.
`.stage-photo` is a fixed layer that covers the viewport with `background-size: cover`,
its opacity interpolated by the same scroll that mixes the colours (0 → 1 → 0 across the
two neighbouring transitions), drifting ±60px against the scroll so it sits further back
and dissolves rather than leaves. The section keeps `data-theme="black"`, so the colour
underneath the photo is black and the ink stays white.

Layering is explicit — photo on `z-index: 0`, sections and footer on `1`, frame on `5`,
header on `10`. A negative z-index would also work, but only by relying on the body's
background propagating to the canvas; too subtle to rest the page on.

**Kept.** Proposed as a test, approved by the client on 2026-09-02 after seeing it. The
mechanism is generic: any section can take a photographic ground by getting
`data-photo="true"` and its own image — nothing in the JS is specific to this one section
beyond the single image url in the CSS.

### The three live colours

JS keeps three custom properties on `<html>`, all interpolated against the scroll:

| Property | What it is |
|---|---|
| `--ground` | what the page is painted with — the section's own colour |
| `--ink` | everything drawn on the ground: text, the filled button, the logo square |
| `--ink-invert` | what is drawn **on the ink**: a filled button's label, the logo mark |

`--ink-invert` is the **opposite ink, never the ground**. It was the ground briefly and the
client rejected it on sight: on the green hero it made the label inside the black pill green
and the logo mark green inside its black square. It is white on the light and green
sections, black on the two black ones, and it cross-fades on the same scroll as the other
two. Secondary buttons take `--ink` for the label and the stroke, and swap to `--ink-invert`
on `--ink` when they fill on hover.

### The section boundary — one scrubbed pass

**Everything a section change drives is scrubbed by the same scroll, in one place.** One
`ScrollTrigger` per boundary, `top bottom` → `top top` on the incoming section, so every
value finishes at the exact instant that section lands. Nothing gets a wall-clock transition
of its own: the frame's slides used to, and the client caught it — the ground had finished
recolouring while the photograph was still most of a 0.9s fade behind, because the swap only
fired once the boundary had passed the middle of the header.

That one pass writes the three colours, the photographic ground's opacity, and each slide's
`--t`. Two hooks come out of it, both synchronised by construction, for whatever a section
has to do next — an element flying out of the frame, a caption, a video:

| Hook | What |
|---|---|
| CSS | every slide carries `--t`: 0 fully off stage, 1 fully on. Read it from anything inside that slide — `translate: calc((1 - var(--t)) * 40px)`. Slide children are **not** clipped, so they can leave the frame. Opacity is only the first consumer: `opacity: var(--t, 0)`. |
| JS | `section:scrub` on `document`, every step of every crossing: `{ from, to, t }` — the two section elements and 0..1. |

The two ends of a crossing are pinned with `onLeave` / `onLeaveBack`, and `settleSlides()`
sets the slides from geometry at rest, on load and on refresh: `onUpdate` never fires for a
boundary cleared in one jump, which a deep link does. Slide opacity comes from JS now, so
with JS off the frame is empty. `--fade` is declared and unused — the one place a wall-clock
fade would go if anything needs one again.

**Known gap:** the frame's dashed placeholder outline is still keyed to `data-active`, which
flips at the middle of the header, so crossing away from the hero it can reappear as a
hairline while the photograph is still scrubbing out. Not fixed — the outline is also what
the closer's morph overrides.

### The `section:change` event

Separate from the scrub, and still useful for things that happen *at* a change rather than
*across* it. Every switch fires a `CustomEvent` on `document`, so anything later — starting
a video, cueing a caption — hooks on without touching `main.js`:

```js
document.addEventListener('section:change', (e) => {
  e.detail; // { id, theme, ink, isSection, ground }
});
```

`id` is the section's element id (`'footer'` for the footer), `theme` and `ink` are the
ground's own data attributes, `isSection` is false only for the footer.

### The page grid

**Built the way cash.app builds theirs**, read off their live page on 2026-09-02:

- one grid for the whole page — `1fr [content] repeat(12, ≤cap) [content] 1fr`;
- a **fixed** gutter, never a percentage;
- the columns have a **maximum**, and once the screen is wider than the content can use the
  surplus goes to the two edge tracks, not to the columns;
- sections span the full width and place their parts on named lines, so everything lands on
  the same rhythm. Theirs: headline `1 / span 4`, the phone `5 / span 4`, the text
  `9 / span 4` — thirds of twelve.

Measured on cash.app: 12 columns, a flat 20px gutter, columns capped at 102px, so the
content stops at 1444 and the margins grow — 0 at 1280, 16 at 1512, 220 at 1920.

Ours keeps the architecture and our own proportions: our gutter rather than their 20, and a
column cap picked so the content stops where it already did.

```css
--grid-cols: 12;
--grid-gutter: clamp(40px, calc(2.5vw + 16px), 64px);
--grid-col-max: 83px;      /* 12 × 83 + 11 × 64 = 1700, the width the page already had */
--grid-margin: var(--page-pad);
```

`--grid-content`, `--grid-col` and `--frame-w` are **derived from those** — do not set them
by hand. The frame is the middle four columns; because `.stage-frame` is fixed-positioned it
cannot read the grid, so `--frame-w` spells the same span out and the slot in the flow uses
it too. They are measured equal in the browser.

| viewport | margin | column | gutter | each area |
|---|---|---|---|---|
| 1440 | 76 | 60 | 52 | 395 |
| 1512 | 79 | 66 | 54 | 416 |
| 1920 | 110 | 83 (capped) | 64 | 524 |

**What this changed.** The three areas are now equal — 4 / 4 / 4 of twelve. Before, the two
text columns had a floor and the frame took whatever was left, which made it wider than a
third on a big screen: 424 / 380 at 1440 became 395 / 395, and 720 / 428 at 1920 became
524 / 524. On a laptop that is within a few percent of what it was; at 1920 the frame gives
up nearly 200px to the text.

**There is no third symmetric split available.** `3 / 6 / 3` would put the frame back up
(818 at 1920) but leaves the text columns at 284 on a laptop, and the titles need about 380.
So if the frame should be wider than a third again, it has to come from asymmetric spans or
from a wider content cap — ask before changing it.

The cases and closer sections lay themselves out rather than sitting on the grid, but they
take `--grid-content` as their width, so all seven screens share the same left and right
edges. Verified: every section's content starts at 76 and ends at 1364 on a 1440 screen.

## 6. Content

- **All copy comes from the client.** Never invent product copy — ask. v1 is in §4.
- No stats / rates / "N million users" blocks on this page.
- Product screens exist (see §7) and other graphics exist and will be supplied later.

## 7. Brand

### Colors (fixed)

| Name (RU) | Name (EN) | HEX | Role |
|---|---|---|---|
| Чистый белый | Pure white | `#FFFFFF` | Ink on the dark sections. **No longer used as a section ground** — the client replaced both white sections with smoky white. |
| Дымчато-белый | Smoky white | `#E9EBEE` | Light airy panels, readability, palette balance. |
| Ярко-зелёный | Bright green | `#A6ED00` | Brand accent: entrepreneurial freedom, growth. |
| Чистый чёрный | Pure black | `#000000` | Base of the visual system. Sections 4, 7, footer. |
| Глубокий графит | Deep graphite | `#1A1817` | Warm neutral dark. **Unused on this page.** |
| Тициановый | Titian red | `#DC200C` | Action energy. **Unused on this page.** |

### Logo

Vendored in `assets/logo/`, pulled from Figma node `196:46920`:

| File | What it is |
|---|---|
| `alphaseller-logo.svg` | Full lockup: mark + "Альфа Селлер", 1037×91. |
| `alphaseller-mark.svg` | Mark only ("A" arrow glyph), 153×102. |

Both ship with hardcoded `fill="black"` — swap to `currentColor` when wiring the navbar
recolor.

**The header uses the mark only, inside a 52×52 rounded square.** The full lockup is not
used on this page.

### Social icons

Vendored in `assets/icons/` as `telegram.svg`, `instagram.svg`, `vk.svg`, `mail.svg`, from
Figma node `201:56530` (four 52.94×52.94 groups). Verified 2026-09-02: the vendored files
are **byte-identical** to a fresh export, so there is nothing to re-pull.

**They are two-colour assets and must be placed as `<img>`, never masked.** Each is a white
squircle badge whose glyph is carved out of the badge path over a `#0F0F0F` backplate rect —
the glyph is a difference in *colour*, not in alpha. 93.1% of the box is opaque (measured by
rasterising each file to 40×40 and counting `alpha > 200`), so `mask` painted a solid
square. Placing them costs nothing: the footer's ground is black in every state, so there is
no recolour for the icon to follow. Rendered at 40×40.

Note the export you want is the **vector-layer** SVG, not the node export — the latter bakes
Figma's own `#1E1E1E` canvas in as a full-bleed `<rect>`.

### Frame content

| Section | File | Figma node | Source |
|---|---|---|---|
| 1 — hero | `assets/images/hero.webp` | `196:53708` | 1118×789, exported @2x → 2236×1578, cwebp `-q 82`, 101 KB |
| 2 — capabilities, `promotion` pane | `assets/images/capabilities-promotion.webp` | `206:62480` | node is named "Продвижение — 4×3 / content". 1118×838.5, @2x → 2236×1677, cwebp **`-lossless`**, 172 KB |
| 2 — `orders` pane | `assets/images/capabilities-orders.webp` | `209:35586` | same size and export, 188 KB. Re-pulled once after the client edited the node — the file name stays, so a re-pull is a byte swap and nothing else |
| 2 — `logistics` pane | `assets/images/capabilities-logistics.webp` | `223:37237` | same size and export, but **`-q 90`**, 167 KB |

`209:35586` was on the `promotion` pane first; the client then said that screen is
**Заказы** and supplied `206:62480` for Продвижение, so the file was renamed, not
re-exported.

**Note on the logistics screen:** its own title is «Товары и остатки», not logistics. The
client assigned it to that tab anyway. Flagged — the tab may want renaming.

One file per pane, named after it. `206:58220` was the previous cut of the same screen and
is superseded; `204:51472` before that was the 1.42:1 one.

Slides are filled with a CSS `background-image` on
`.stage-frame__slide[data-for="…"]`, `center / cover`.

**Prefer a source that is already 4:3 — ask for one.** The first capabilities export
(`204:51472`) was 1.42:1 and `cover` clipped the user avatar and the logo's left margin; the
client then supplied `206:58220`, the same screen laid out at 1118×838.5, and it fills the
frame with nothing cropped (measured: image ratio 1.3333 against frame ratio 1.3333). The
hero photograph is still 1.42:1 and does lose 33px off each side at 1x — §3 notes the
mismatch and the client is fine with it there.

**Encode both ways and keep the smaller file.** Flat UI compresses better lossless — on the
promotion screen `-lossless` was 175,616 bytes against 190,262 for `-q 90` — but a screen
with photographs in it flips that: the logistics screen is 196,206 lossless against
**170,734** at `-q 90`. Lossy is safe here because the frame renders these at about a fifth
of their pixel size, so `-q 90` artefacts do not survive the downscale. The hero
photograph is `-q 82`.

A slide that carries an image gets `data-filled="true"` in the markup, which drops the
frame's dashed placeholder outline via `--frame-outline: transparent` — otherwise it is
drawn over the picture. It switches instantly rather than fading; the change lands mid
cross-fade, and giving the outline a transition of its own would fight the per-frame ink
interpolation.

### The capabilities tabs

Under the frame on section 2 sits a strip of three tabs — `Продвижение`, `Заказы`,
`Логистика` — and the frame shows one pane per tab.

They are pills on the buttons' own geometry — same `--btn-h` height, 20px side padding, full
pill radius — so they are the site's existing control rather than a third one:

| State | Look |
|---|---|
| Idle | no fill, 1px stroke in the ink, ink label — the secondary button |
| Active | ink pill, `--ink-invert` label |
| Active, timer running | a **dark grey sweep left to right** across the pill: the elapsed part of the 5s is `--tab-elapsed`, the rest is plain ink |

- The sweep *is* the timer: one GSAP tween moves `--p` and, on completion, advances to the
  next pane, so the bar and the switch cannot drift. It wraps around.
- **Click and it goes manual for the rest of the page's life** — the client's "до
  перезагрузки". The timer never runs again, and `--p` stays at 0%, so the active pill is
  simply ink with no sweep. Leaving the section and coming back does not restart it.
- Green is deliberately **not** used here. The first cut filled the label itself with green
  and the client rejected it: with `--p` at 0% at the start of every dwell all three labels
  read as the same grey, so nothing marked the active tab.
- Nothing runs while the slide is off stage, and the strip is `inert` there — a slide at
  `opacity: 0` still takes clicks and focus. The gate hangs off the slide's own `--t`
  (> 0.99), not off `section:change`: `--t` is written on every path — crossing, jump, deep
  link, refresh — while a discrete toggle can be missed.
- The pane swap *is* a wall-clock cross-fade, unlike a section change: a click or a timer
  has no scroll to scrub against.
- The strip lives inside the slide but is positioned below the frame — slide children are
  not clipped. It is the first user of that.
- `prefers-reduced-motion: reduce` starts in manual mode: no carousel, no fill.

All three panes have screens.

Mine, not the client's — `--tab-fade: 0.4s`, `--tab-gap: 12px`, `--tab-drop: 32px`,
`--tab-elapsed` at 78% ink over the ground (`#333435` on a light section), and reusing the
button geometry. The 5s dwell, the labels and all three states are his. Idle pills have no
hover state: a tab is not a call to action, so it does not fill like `.btn--secondary`.

### Product screens

Vendored in `assets/screens/` as flat PNGs. The client dislikes their current design and
does not want them rebuilt in code — they will be replaced, so they stay images. From Figma
section `196:46923`, exported @2x:

| File | Figma node | Size |
|---|---|---|
| `main.png` | `189:32191` | 2732×1928 (1366×964 @1x) |
| `goods.png` | `189:30585` | 2732×1928 |
| `orders.png` | `189:31107` | 2732×1928 |
| `advertisement.png` | `189:31608` | 2732×1928 |

### Typography

**YFF RARE VF** — the only typeface on the site. Files in `assets/fonts/`:

| File | What it is |
|---|---|
| `YFF-RARE-VF.woff2` | Variable, web format. **Use this one.** |
| `YFF-RARE-VF.ttf` | Same variable font, source TTF. |
| `YFF-RARE-PowerBlack.otf` | Static Power/900 Black cut, if a display weight is needed. |

Verified with fontTools (2026-09-02):

- Axes: `wght` 100–900 (default 500), `wdth` 50–150 (default 100). 81 named instances.
- Width names run Compressed → … → Ultra (wdth 50, 60, 75, 87, 100, 110, 120, 135, 150).
- 325 glyphs, **full Cyrillic coverage** (А–я, Ё/ё present).
- Family name reads `TEST YFF RARE VF Med`, license URL `yourfontfetish.com/eula`.

**The whole site is two type styles. There is no third one — do not add one.**

| Style | Cut | Size / leading | Tracking | Used for |
|---|---|---|---|---|
| `xxl` | Hyper Medium | 56 / 56 at 1440 → 64 / 64 at 1920 | normal | The cases and closer headings |
| `xl` | Hyper Medium | 36 / 36 at 1440 → 44 / 44 at 1920 | normal | Section titles |
| `md` | Hyper Regular | 14 / 18 at 1440 → 18 / 24 at 1920 | 1% (`0.01em`) | Everything else |

"Hyper" is the `wdth 87` width; "Medium" is `wght 500`, "Regular" is `wght 400`. In CSS:
`font-stretch: 87%` plus the weight.

**Every style scales, on the same 1440–1920 window, and is held flat outside it.**

| Style | Size clamp | Leading clamp | 1440 | 1920 |
|---|---|---|---|---|
| `xxl` | `clamp(56px, calc(32px + 1.6667vw), 64px)` | = size | 56 / 56 | 64 / 64 |
| `xl` | `clamp(36px, calc(12px + 1.6667vw), 44px)` | = size | 36 / 36 | 44 / 44 |
| `md` | `clamp(14px, calc(2px + 0.8333vw), 18px)` | `clamp(18px, 1.25vw, 24px)` | 14 / 18 | 18 / 24 |

The two display sizes keep leading equal to the size. `md` needs a **second clamp** for its
leading: the ratio is not constant across the window — 18/14 = 1.286 at 1440 against
24/18 = 1.333 at 1920 — so one multiplier cannot hit both ends. `md` is set once, on `body`,
and inherited everywhere; tracking is in `em` so it follows on its own. Note `h1`/`h2`
default to bold — the title weight must be forced back to 500.

### Control sizes (fixed by the client)

| Element | Size |
|---|---|
| Logo — **mark only, no wordmark**, in a rounded square | 48×48 |
| Header CTA button | 48 high |
| Section CTA buttons (under the subtitle) | 40 high — was 44 until 2026-09-02 |
| Corner radius — logo square, frame, slides | 32 (`--radius-btn`) |
| Corner radius — case cards | 44 (`--radius-card`, `--radius-btn` + 12) |
| Corner radius — buttons and tabs | full pill (`--radius-pill: 999px`) |
| Button side padding — both sizes | 20 (`--btn-pad-x`) |

**Two shapes, three radii.** The frame, its slides and the logo square are rounded at 32
(`--radius-btn`); the case cards at **44** — the client asked for +12 on them alone on
2026-09-02, so they carry their own `--radius-card: calc(var(--radius-btn) + 12px)`; the
buttons and the tabs are full pills (`--radius-pill`). `--radius: 16px` survives only as the
base `--radius-btn` is derived from; nothing uses it directly.

The logo square used to rely on the squircle to survive the 32 radius on a 48px box; that is
still true, and in Safari and Firefox the `border-radius` fallback clamps to 24 and draws a
circle instead. Known divergence, raised with the client.

**The logo square is the only squircle on the page** — `corner-shape: squircle` inside
`@supports`, with `border-radius` as the fallback for Safari and Firefox. Everything else is
plain: the frame and its slides are rounded rectangles at 32, the cards at 44, and the
buttons and the tabs are full pills (`--radius-pill: 999px`). The client narrowed it to the
logo on 2026-09-02 — do not spread it back without asking.

### Button styles

Two styles, one class each:

| Style | Class | Idle | Hover |
|---|---|---|---|
| Primary | `.btn` | filled with the ink, label inverted | — |
| Secondary | `.btn .btn--secondary` | no fill, 1px stroke in the ink colour | fills with the ink, label inverts |

- **Primary is the header CTA only.** Every CTA in the body of a section is secondary.
- The secondary stroke is an `inset` box-shadow, not a `border`, so the box geometry is
  identical to the primary's — 20px of side padding either way.
- The 1px stroke width is the client's. `--hover: 0.2s` is still a placeholder, and
  primary has no hover state yet.

Not specified yet, currently placeholders in CSS: the logo square's fill, the mark's size
inside it (24px), and the header's bottom padding (20px).

> **Licensing flag:** these are TRIAL/TEST files. Fine for an internal board demo,
> **not** licensable for a public launch. A commercial license must be bought before the
> real site ships. Raised with the client, not yet resolved.

## 8. Stack and constraints

- Vanilla HTML + CSS + JS. No framework, no build step, no bundler.
- **GSAP** (+ ScrollTrigger) for scroll animation.
- Fonts self-hosted from `assets/fonts/`, `font-display: swap`.
- **Viewport: must look right across 1440–1920 px wide.** Desktop only — no mobile or
  tablet layout in this phase.

## 9. Repo and deploy

- `github.com/levalovushka/alphaseller` — public, was empty on 2026-09-02.
- Local working copy: `/Users/levonlobanov/Desktop/alphaseller`.
- The client wires **Netlify autodeploy** from that repo, so the repo root must be directly
  servable as a static site (`index.html` at root, no build step).

## 10. Design source

Figma: `Vp4DJG9ZvWkstVNKiihM0Q` — "Альфа Селлер". Single page `38:22805` ("Show").

Known nodes:

| Node | What |
|---|---|
| `1:49642` | The main board — 141399×53272 px, holds many frames. |
| `196:46920` | Logo (full lockup + mark). |
| `196:46921` | Footer element inventory. |
| `196:46923` | Product screens (4 frames, 1366×964 each). |
| `201:56530` | Social icons — Telegram, Instagram, VK, mail. |
| `196:53708` | Hero photograph — man on a chair, red gradient ground. |
| `209:35586` | Dashboard screen, 4:3 — the capabilities frame's **`orders`** pane. Supersedes `206:58220`, which superseded `204:51472` (the 1.42:1 cut). |
| `206:62480` | "Продвижение — 4×3 / content" — the capabilities frame's `promotion` pane. |
| `223:37237` | «Товары и остатки» screen, 4:3 — the capabilities frame's `logistics` pane. |

`get_metadata` on `1:49642` and on `196:46923` overflows the MCP transport. Read frame by
frame; ask the client for direct links.

### The hero frame is empty

The photograph that filled the hero slide was taken off the first screen by the client on
2026-09-02. `assets/images/hero.webp` **stays in the repo** — he wants it again later, just
not there. The slide is back to the dashed empty frame; putting it back is one
`data-filled="true"` and one `background-image`.

## 11. Verifying in the browser

Two traps, both hit more than once:

- **The stylesheet caches independently of the page.** A query string on the document does
  not bust `base.css`, so measurements can silently run against the previous CSS. Before
  measuring anything style-dependent, swap the link:

  ```js
  const link = document.querySelector('link[rel="stylesheet"]');
  const fresh = link.cloneNode();
  fresh.href = '/assets/css/base.css?cb=' + Date.now();
  document.head.appendChild(fresh);
  await new Promise((r) => fresh.addEventListener('load', r));
  link.remove();
  ScrollTrigger.refresh();
  ```

- **Console errors accumulate across loads**, so a clean page still shows old 404s. Check
  `performance.getEntriesByType('resource').filter((e) => e.responseStatus >= 400)` instead.

## 11. Open questions

- Type scale — client is deciding.
- Which screen / video / people go into which section frame — later; frames stay empty.
- Date of the board meeting — unknown.
- Font license for production — unresolved.
