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
| 6 | Cases | Black `#000000` — card grid, see below |
| 7 | Closer + footer | Black `#000000` — one screen, see below |

**Red is not used on this page at all** (for now). Both dark sections use pure `#000000`;
`#1A1817` is unused. Pure white is no longer a section ground either — the four light
sections are all smoky white, so the page reads green → smoke → smoke → black → smoke →
smoke → black.

### Copy — v1, from the client, 2026-09-02

Every section carries exactly three strings: title, subtitle, CTA label.
**Neither titles nor subtitles carry a trailing period** — the client removed them.

| # | Title | Subtitle | CTA |
|---|---|---|---|
| 1 | Одна платформа на всю онлайн-торговлю | Продавай больше, управляй с легкостью, расширяй аудиторию с единой платформой для управления электронной коммерцией | Начать бесплатно |
| 2 | Весь цикл продаж в одном кабинете | Свой сайт, приложение, аналитика, управление рекламой и логистикой, деньги, остатки и отзывы | О платформе |
| 3 | Свои каналы продаж за один день | Онлайн-витрины без подрядчиков, с привязкой к Telegram и Max — рабочие, красивые и с твоей наценкой | Сделать сайт |
| 4 | Стиль магазина уникальный, как ты сам | Выбирай из стильных шаблонов и докручивай, пока не будет идеально подходить под твой вкус | Посмотреть шаблоны |
| 5 | Управляй своим бизнесом на маркетплейсах | Даём аналитику по заказам, остаткам, логистике и помогаем выбрать лучшие карточки товаров | Подключить |
| 6 | С нами работают самые смелые | *(unused — the cases layout has no subtitle column)* | Все кейсы |
| 7 | Продавай по своим правилам | Верни контроль над бизнесом и заставь его работать на твою мечту | Начать бесплатно |

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
at the top left, four equal cards along the bottom. Black ground, cards in
`--c-graphite` — the one place the warm dark from the palette is used. No subtitle column,
so the subtitle that section used to have is currently unused.

**The frame does not appear here.** The section carries `data-frame="none"`, and instead of
fading out the frame *leaves* — upward, one viewport, at exactly the speed of the section it
belonged to, so it reads as part of that screen departing. It is parked a viewport above
until the closer brings it back down as the button, which is why the two moves share a
"parked" position and nothing jumps between them.

Placeholders waiting on the client: the four card logos (empty slots at the moment) and the
card copy, which is one sentence repeated four times.

### Closer + footer — one screen

The last section and the footer are a single 100vh block, not two. Title top-left under the
header, subtitle top-right, the footer's four columns along the bottom, and in the middle —
where the frame stands on every other section — the call to action.

**The call to action is the frame itself.** It does not fade out and hand over to a separate
green block (that was the first attempt, and it was not what the client wanted). Across the
approach to the closer the frame *becomes* the button, everything scrubbed to the scroll so
it completes exactly as that screen lands:

| | from | to |
|---|---|---|
| size | `--frame-w` (553 at 1440) | **200×150** — same 4:3, smaller |
| fill | 6% of the current ink | opaque `#A6ED00` |
| outline | 25% dashed | transparent |
| label | invisible | `Начать бесплатно`, and it starts taking clicks |
| position | the content's optical centre | the **screen's** centre |

That last row matters: on every other section the frame sits on the optical centre of the
content, which the header pushes ~20px below the middle of the screen. As a button it reads
as sitting low there, so the morph takes the offset out. The closer's head also gets 32px
more air under the navbar than a normal section's top padding gives.

The label lives in the frame's `closer` slide as a real `<a>`; the other six slides stay
`aria-hidden`. `pointer-events` only open up at the end, on `.stage-frame[data-cta="true"]`.
The closer's middle grid row is an empty spacer — the frame is fixed and comes to rest in it.

The fill is interpolated in JS rather than by a CSS transition because it starts from a live
value: 6% of `--ink`, which is itself moving.

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

Same visible result, built on **native page scroll** — no wheel hijacking, no smooth-scroll
library, nothing pinned. `assets/js/main.js`, GSAP 3.15 + ScrollTrigger vendored in
`assets/vendor/`:

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

### The three-column stage

`--page-pad` is `clamp(76px, calc(4.4vw + 12px), 96px)` and `--col-gap` is
`clamp(24px, 2.5vw, 48px)`. The two text columns have a floor of `--col-min` (380px) and the
frame takes what is left, capped at 760px.

On a 1920 screen the side margin comes from `--page-max` (1704px), not from the padding —
the container hits its cap before the padding matters. Both numbers have to move together to
change the margin there.

The **header is not on this grid**: it is full-bleed with a 16px side inset, so the logo and
the CTA sit closer to the edge than any section content does. That is deliberate.

The column floor is a composition choice, not a constraint — how much screen the text keeps
before the frame takes the rest. It stopped being a constraint when the xl size came down: at 36px the longest word in the
copy sits well inside a 380px column.

**Titles are set with `text-wrap: balance`**, so lines even out instead of each being filled
to the column edge. It never breaks a word, so it composes with the non-breaking spaces
rather than fighting them.

**Hyphenation is off, deliberately.** It was on while titles set at 44px and a long word
could overflow, and it then did harm: `hyphens: auto` split `бизнесом` across two lines to
even out the rag, when the word fits whole on the next line. Only `overflow-wrap: break-word`
remains, which fires solely for a word too long for its column — no current title is.

Measured:

| viewport | xl | frame | side margin |
|---|---|---|---|
| 1440 | 36 / 36 | 456 | 76 |
| 1512 | 37.2 | 519 | 79 |
| 1920 | 44 / 44 | 760 | 108 |

For anyone tempted to re-tune the frame: it has been 416, 473, 553, 513, 480 and now 456
across this conversation. The client keeps choosing the moderate end — do not "fix" it
upward without asking.

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
| 2 — capabilities | `assets/images/capabilities.webp` | `206:58220` | 1118×838.5 — **a true 4:3**, exported @2x → 2236×1677, cwebp **`-lossless`**, 206 KB |

Slides are filled with a CSS `background-image` on
`.stage-frame__slide[data-for="…"]`, `center / cover`.

**Prefer a source that is already 4:3 — ask for one.** The first capabilities export
(`204:51472`) was 1.42:1 and `cover` clipped the user avatar and the logo's left margin; the
client then supplied `206:58220`, the same screen laid out at 1118×838.5, and it fills the
frame with nothing cropped (measured: image ratio 1.3333 against frame ratio 1.3333). The
hero photograph is still 1.42:1 and does lose 33px off each side at 1x — §3 notes the
mismatch and the client is fine with it there.

**A UI screen is encoded lossless, a photograph is not.** On the capabilities screen
`-lossless` came out both smaller and sharper than `-q 90` (205 KB against 207 KB), and
lossy encoding softens small type.

A slide that carries an image gets `data-filled="true"` in the markup, which drops the
frame's dashed placeholder outline via `--frame-outline: transparent` — otherwise it is
drawn over the picture. It switches instantly rather than fading; the change lands mid
cross-fade, and giving the outline a transition of its own would fight the per-frame ink
interpolation.

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
| `xl` | Hyper Medium | 36 / 36 at 1440 → 44 / 44 at 1920 | normal | Section titles |
| `md` | Hyper Regular | 16 / 21.33 at 1440 → 18 / 24 at 1920 | 1% (`0.01em`) | Everything else |

"Hyper" is the `wdth 87` width; "Medium" is `wght 500`, "Regular" is `wght 400`. In CSS:
`font-stretch: 87%` plus the weight.

**Both styles scale, on the same 1440–1920 window, and are held flat outside it.**

| Style | Clamp | 1440 | 1920 |
|---|---|---|---|
| `xl` | `clamp(36px, calc(12px + 1.6667vw), 44px)` | 36 / 36 | 44 / 44 |
| `md` | `clamp(16px, calc(10px + 0.4167vw), 18px)` | 16 / 21.33 | 18 / 24 |

`xl`'s leading always equals the size. `md`'s keeps the designed 4:3 ratio to it
(`calc(var(--fs-md) * 4 / 3)`), so it tightens with the size instead of holding 24 flat —
client's call if he wants it flat instead. `md` is set once, on `body`, and inherited
everywhere; tracking is in `em` so it follows on its own. Note `h1`/`h2` default to bold —
the title weight must be forced back to 500.

### Control sizes (fixed by the client)

| Element | Size |
|---|---|
| Logo — **mark only, no wordmark**, in a rounded square | 48×48 |
| Header CTA button | 48 high |
| Section CTA buttons (under the subtitle) | 44 high |
| Corner radius — buttons, logo square, frame | 32 (`--radius-btn`) |
| Button side padding — both sizes | 20 (`--btn-pad-x`) |

**Everything rounded on the page carries the same radius, 32.** `--radius: 16px` survives
only as the base `--radius-btn` is derived from; nothing uses it directly. 32 exceeds half
of both button heights (44 and 52), so browsers clamp it and the buttons render fully
rounded. On the 52×52 logo square the squircle corner shape absorbs the clamp and it still
reads as a rounded square — but the `border-radius` fallback in Safari and Firefox clamps to
26 and draws a full circle. Known divergence, raised with the client.

The logo square is a **squircle with a fallback**: `border-radius` for Safari and Firefox,
`corner-shape: squircle` inside `@supports` for Chrome 139+. It applies to **everything
rounded** — the logo square, both buttons and the frame.

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
| `206:58220` | Dashboard screen, laid out 4:3 — the capabilities frame. Supersedes `204:51472`, the 1.42:1 cut of the same screen. |

`get_metadata` on `1:49642` and on `196:46923` overflows the MCP transport. Read frame by
frame; ask the client for direct links.

## 11. Open questions

- Type scale — client is deciding.
- Which screen / video / people go into which section frame — later; frames stay empty.
- Date of the board meeting — unknown.
- Font license for production — unresolved.
