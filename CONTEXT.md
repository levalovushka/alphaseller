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

Header + 8 sections + footer.

| # | Section | Background |
|---|---|---|
| 1 | Hero | **Four variants since 2026-09-03, switched live — see "The four hero variants" in §5.** Variant 1 is the one that stood before: graphite `#1A1817` with the photograph laid over it by the morph panel |
| 2 | Key capabilities | Smoky white `#E9EBEE` |
| 3 | Speed | Black `#000000` — since 2026-09-03; was smoky white |
| 4 | Customization | Black `#000000` |
| 5 | Marketplaces | Smoky white `#E9EBEE` |
| 6 | Cases | Smoky white `#E9EBEE` — the ordinary three columns; the cards are a carousel in the frame, see below |
| 7 | Growth tiles | Black `#000000` — six tiles, no frame, added 2026-09-03, see below |
| 8 | Closer + footer | Black `#000000` — one screen, see below |

**Red is not used on this page at all** (for now). The three dark sections use pure
`#000000` and the hero uses graphite. Pure white is no longer a section ground either — the
light sections are all smoky white, so the page reads **graphite** → smoke → black → black →
smoke → smoke → black → black. **Green is now on the page nowhere at all** — it was only ever the
hero's ground and the morph panel, and both went graphite on 2026-09-03. Worth raising with
the client: the brand accent has left the page. Sections 3 and 4 are now adjacent blacks: nothing changes colour across that
crossing, only the ink stays put and the frame's content swaps.

### Copy — v1, from the client, 2026-09-02

Every section carries exactly three strings: title, subtitle, CTA label.
**Neither titles nor subtitles carry a trailing period** — the client removed them. A ⏎ in
the table is a hard `<br>` in the markup: the client sets those titles' line breaks by
hand rather than leaving them to `text-wrap: balance`.

| # | Title | Subtitle | CTA |
|---|---|---|---|
| 1 | Одна платформа ⏎ для управления ⏎ ecom-бизнесом | Продавай больше, управляй с легкостью, расширяй аудиторию с единой платформой для управления электронной коммерцией | Начать бесплатно |
| 2 | Весь цикл ⏎ в одном кабинете | Свой сайт, приложение, аналитика, управление рекламой и логистикой, деньги, остатки и отзывы | — **dropped** |
| 3 | Твоё приложение ⏎ и интернет магазин ⏎ за один день | Онлайн-витрины без подрядчиков, с привязкой к Telegram и Max — рабочие, красивые и с твоей наценкой | Сделать сайт |
| 4 | Стиль магазина уникальный, как ты сам | Выбирай из стильных шаблонов и докручивай, пока не будет идеально подходить под твой вкус | Посмотреть шаблоны |
| 5 | Управляй своим бизнесом на маркетплейсах | Даём аналитику по заказам, остаткам, логистике и помогаем выбрать лучшие карточки товаров | Подключить |
| 6 | Работают ⏎ и побеждают ⏎ с нами | Огромные корпорации и небольшие бизнесы уже вернули контроль в свои руки с нашей платформой | Все кейсы |
| 7 | Приводите ⏎ и удерживайте ⏎ клиентов | — **none** | — **none** |
| 8 | Альфа Селлер работает на твою мечту | — **dropped** | Начать бесплатно — **under the heading**, and filled like the header's, since 2026-09-03 |

- **Section 2 has no CTA.** `О платформе` was removed on 2026-09-02 once the frame got its
  tabs: the tabs are the thing to interact with there, and a second control next to them
  competed with the first.
- Sections 1 and 7 share the CTA `Начать бесплатно`, and the header carries it too. **This
  repetition is intentional** — do not "fix" it.
- **Section 8 has no subtitle** either, dropped on 2026-09-03: the heading carries that
  screen alone, over the photograph.
- **Section 6's subtitle is back.** It went unused while that screen was a card grid; the
  client asked for it again when the cards moved into the frame, "придумай или возьми из
  первых итераций" — so it is the v1 line from `f0286fd`, unchanged.
- **Section 7 carries a title and six tiles, nothing else** — no subtitle, no CTA, on the
  client's word. The tile copy is his, read off Figma `276:54325`.
- Copy is v1 and will change. Keep every string in one place in the markup so swapping is
  cheap.

### Header

- Logo: the full Alpha Seller lockup, mark plus wordmark (no Alfa-Bank lockup).
- Links: `Продукты`, `Тарифы`, `Крупному бизнесу`, `Примеры`, `Блог`.
- Button: `Начать бесплатно`.
- **Full-bleed**, not inside the page container: a flat 16px inset on all four sides. The
  height follows from the padding plus the 48px controls; nothing fixes it — it lands at 80.
  The logo takes 8px more on the left than the bar's inset (so it starts at 24, while the
  button's right inset stays 16): the lockup begins with the mark, which has no side bearing
  of its own, and at a flat 16 it read as flush against the edge.
  **The padding has to stay symmetric**: it was 16 top / 20 bottom for a while, and that put
  the logo, the links and the button 2px above the bar's centre line, which the client saw.
- **The nav links sit on the screen's centre**, not in the middle of the space left over
  between the logo and the button. Implemented as a `1fr auto 1fr` grid.
- The ground is light but sections 1, 4 and 7 are green/black. **The navbar must recolor
  itself against the section currently under it** (or an equivalent solution). Real
  requirement — plan for it in the section markup.

### Cases

Section 6 went back to the ordinary three columns on 2026-09-03, on the client's call:
"давай сделаем секцию 'работают с нами' тоже с рамкой в центре. то, что в нём сейчас в
плашках — должно встать в рамку, а рамка должна стать каруселью. переиспользуй стрелочки из
блока с тиндер-механикой."

- Title left (`xl` since 2026-09-03 — it was `xxl` while this screen was a card grid —
  two hand-set lines), the frame in the middle, subtitle and the
  `Все кейсы` button right — exactly like every other section.
- **The frame is a carousel**: one case card at a time, white plate and black type of its
  own, walked by the same two arrow buttons the style deck carries (`.deck-nav`,
  `.deck-arrow` — one markup, one stylesheet, two users). No drag and no timer: these are
  quotes, not a thing to play with. The rail wraps in both directions.
- Leaving the section resets it to the first case, so a visitor who comes back sees the
  screen as it was written.
- What the curtain clips is the **track**, not the rail: the track fills the frame's box
  exactly, so the wipe behaves like a picture's while the rail may be four cards wide, and
  the arrows, which hang below the box, are untouched.
- The card grid, `.cases__head` and the frameless layout for this section are **gone**. If
  a grid is ever wanted again, `git show 48e3f11` has it.

The partner logos (`assets/logos/`, from Figma node `32:29061` — KINASH, Домодедово,
12 месяцев, M.Reason) ship **white on transparent**, and there is no dark version of the
source artwork. Three of them are therefore inverted in CSS (`[data-invert="true"]`) to sit
on a white card. M.Reason is not: it is dark lettering on its own white plate and already
reads correctly. Proper dark exports would be better than the filter.

**The card copy is placeholder written by me**, at the client's request, four sentences in
the site's voice. Replace it with real cases before this goes anywhere near a customer.

**The frame leaves on the section after this one**, not on this one — see below.

### Growth tiles

Section 7, added 2026-09-03. The client has not drawn it yet; he gave the layout in words
and the copy in Figma (`276:54325`): "он будет черный, без рамки по центру а с шестью
плашками… сабтайтла не будет, кнопки в блоке не будет", then, on seeing it: "давай наоборот
— текст слева, справа карточки. карточки должны быть квадратные всегда. текст в карточках
надо переработать — сократить и превратить в один блок текста, а не тайтл и сабтайтл. текст
прижимай к нижней границе плашки."

- Heading alone in the **first** page column, six tiles in a 3×2 grid across the other two —
  the same three-column grid the rest of the page uses. Both start on the same line.
- **The tiles are always square.** Width comes from the grid, height from the ratio: 293 at
  1440, 388 at 1920. Nothing caps the height, or the ratio would go instead.
- One block of text per tile, on its **top edge**, in the new `lg` style; 24px padding all
  round. Everything **below** the text is the room the illustrations will take — that is why
  the square is worth the space it costs. (The text was on the bottom edge for one round:
  "я тебя обманул про 'прижми' к нижнему краю, давай текст к верхнему всё таки и заодно
  сделаем покрупнее… снизу будут иллюстрации.") At 1440 that leaves 139-191px under the
  text, at 1920 244-274.
- **The tiles are styled after Figma `279:54342`**, which the client sent on 2026-09-03:
  - The first tile is the bank's: `--c-red` ground, white type, the Alfa "А" standing at its
    foot (`assets/logos/alfa-a.svg`, from `279:54330`, stripped of the canvas rect Figma
    exports behind it). **This puts the brand red back on the page** — it had been nowhere
    since the hero went graphite.
  - Four tiles carry a 3D still at the foot: ads `279:54331`, loyalty `279:54334`, bloggers
    `276:54324`, partners `279:54335`. **Three of them go into the bottom-left corner with no
    margin at all** — the client took the rounded corners off those three in Figma on
    2026-09-03 and re-exported them ("просто воткни с нулевым маржином в левый нижний угол…
    касается исключительно сердца, процента и человечка с плюсом"). The Я/VK pair keeps the
    tile's 24px padding: it is a pair of logos, not a plate, with nothing square to line up
    against the edges.
  - **Each file is trimmed to its object.** Figma exports them inside a padded box, and with
    the padding on they stood at four different heights — the Я/VK pair floated on 52px of
    empty pixels while the others touched the bottom of theirs. Trimmed with `ffmpeg crop` to
    the alpha bounding box.
  - **The four are sized by weight, not by box.** The measure is the square root of each
    one's opaque area — its visual side — normalised to ~100px against a 293px tile: ads 24%
    of the tile's height, bloggers 30%, loyalty 30%, partners 34%. A flat height made the
    widest and flattest of them (the logo pair) the heaviest thing on the screen. Client:
    "попробуй их расставить сбалансированно по визуальному весу."
  - **The stills come out of Figma on its `#1E1E1E` canvas, not on transparency**, so each
    was keyed on that colour (`ffmpeg colorkey`, threshold 0.02) and written as a webp with
    alpha. Without it every tile would carry a grey slab across its foot. Fewer than 30
    pixels per image were bitten out of the object itself.
  - **The sixth tile's ground is a voice-assistant orb** — `assets/js/tile-shader.js`, a
    WebGL 1 canvas filling the tile under the text, in the brand green (`#A6ED00`). The first
    cut was a flat marbled field; the client rejected it on 2026-09-03: "нужно что-то более
    похожее на thinking / voice assistant анимацию… и надо чтобы на мышь реагировал."
  - **The technique**, which is what every orb in that family (react-bits' Orb on OGL,
    ElevenLabs' UI orb, the Skia `react-native-magic-orb`) is built out of:
    polar coordinates around a centre; a noise field modulating the **radius**, so the edge
    breathes instead of being a circle; inverse-square falloffs standing in for lights — one
    on the rim, three orbiting inside at different speeds and directions, which is the
    "thinking" motion; smoothstep rings for the inner fade and an exponential halo outside.
    Nothing is imported: the demo runs with no network, and every library in that space is
    React.
  - **Half the size** since 2026-09-03 ("нужно его сделать в почти два раза меньше"):
    radius 0.27 in uv units against 0.52. Every distance-based constant moved with it — the
    rim's falloff doubled, the lamps' quadrupled, the halo's steepened — or the smaller orb
    would have had a fatter edge than the big one.
  - **It stands in the bottom-left corner, 28px clear of both edges**, which is the `u_margin`
    uniform (CSS px, scaled to canvas pixels at draw time, so it holds at either device
    ratio). It was centred for one round and the client called that a mistake, then sat at 20
    until he asked for "ещё 8 пикселей отступа точно" on 2026-09-03. Measured at 28: the lit
    body starts 26.5px from the left edge and 27px from the bottom at 1440, its faint halo
    reaching a few px closer, which is what a glow does.
  - **The pointer**: the orb leans toward it (10% of the way), the uv ripples with it, and
    the whole thing brightens and runs half again as fast. Everything the pointer drives is
    eased in JS toward its target each frame, so it follows the hand rather than snapping,
    and settles back to the middle on `pointerleave`. Tracked on the **tile**, not the
    canvas — a pointer over the words is still a pointer over the tile.
  - It is dark where the text is (measured luminance ≤26 across the text's own strip at
    1920) and bright at the foot. The loop runs only while the tile is on screen (an
    IntersectionObserver) and draws a single frame for a visitor who asked for less motion.
    **This is the second place the brand green is back**, after the red on the bank tile.

**Tile copy**, shortened by me from the client's Figma pairs, which were a title plus a
sentence each. His originals mixed «ты» and «вы» (`Охвати` next to `Повышайте`); these are
all «ты», like the rest of the site.

| # | Figma original | On the page |
|---|---|---|
| 1 | Охвати аудиторию Альфа-Банка / Размести товары бесплатно в приложении в разделе Маркет — клиенты банка их увидят | Размести товары в разделе Маркет — их увидят клиенты Альфа-Банка |
| 2 | Размещай рекламу в VK и Яндексе / Получите двойную выгоду: новых клиентов и кэшбэк 10% за оплату рекламных кабинетов | Запускай рекламу в VK и Яндексе с кэшбэком 10% за оплату кабинетов |
| 3 | Повышайте лояльность / Автоматизируйте рассылки, предлагайте бонусы и скидки по категориям, товарам, брендам | Повышай лояльность: автоматические рассылки, бонусы и скидки |
| 4 | Экономь на продвижении у блогеров / Подбери инфлюенсеров без пересечения аудитории, узнай подписки клиентов — получи максимальный охват и продажи | Подбирай блогеров без пересечения аудитории — плати за охват, а не за повторы |
| 5 | Привлекай покупателей у партнёров / Размести своё предложение на витрине подарков и получи новых клиентов | Размести предложение на витрине подарков и получай клиентов от партнёров |
| 6 | Прокачай сервис с помощью ИИ / Подключи человечного и умного бота для общения с покупателями | Подключи умного бота — он ответит покупателям за тебя |

### Closer + footer — one screen

The last section and the footer are a single 100vh block, not two. Title top-left under the
header, subtitle top-right, the footer's four columns along the bottom, and in the middle —
where the frame stands on every other section — the call to action.

Its heading carries `xxl`, and the heading and the button under it are wrapped in
`.closer__lead`, which is what runs under the frame column (`grid-column: 1 / 3`) — one text
column is too narrow at that size. The wrapper is there because `.closer__head` is a
three-column grid with a `--col-gap` on both axes: a bare button beside the heading would
auto-place into the free third column, and a second grid row would space it off the heading by
the column gap. Stacked, it takes the 24 the section asides use between a text and their
button.

**The middle of this screen is empty; the call to action moved under the heading.** The frame
used to travel back down and shrink into a green `Начать бесплатно` button in the middle; the
client detached that while he redraws the footer, so the middle grid row is a bare spacer. On
2026-09-03 he asked for the button back — but under the heading, and **filled** like the
header's (`.btn`, white plate, black label) rather than the stroke every section body uses.
He was offered stroke / filled / green and took filled. The closer's head gets 32px more air under the navbar than a normal
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
2. The frame holds one `.stage-frame__slide` per section, and what it shows **wipes**
   bottom to top as the section changes — see "the curtain" below. Nothing in the frame
   fades. Slides are empty on the sections the client has not supplied content for.
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
5. **There is no entrance reveal on the section text — removed, the client's call**
   (2026-09-03), and it was his own feature the same day: title first, body 0.3s behind,
   replaying on every entry. He changed his mind and asked for it gone entirely, so the
   rise-and-fade, its ScrollTrigger and the catch-up sweep that existed only to serve it
   are all out. A section's text is simply there when the section arrives. Do not add it
   back on the argument that the sections feel static — that is the state he chose. It is
   in the history if he wants it again (`git log -S REVEAL`).

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

**It backs the closer** — the last screen of the page — since 2026-09-03.
`assets/images/closer.webp`, from Figma node `201:56528`, 1858×2000, 75 KB.
`.stage-photo` is a fixed layer that covers the viewport with `background-size: cover`,
its opacity interpolated by the same scroll that mixes the colours, drifting ±60px against
the scroll so it sits further back and dissolves rather than leaves. The section keeps
`data-theme="black"`, so the colour underneath the photo is black and the ink stays white.

**It was the customization section's until the client moved it** on 2026-09-03: "убираем
фото девушки с фона, делаем слайд пока что черным. фото девушки ставим на последний самый
слайд закрывашку." That screen is now flat black, so the deck of shop screens is the only
thing on it. The file is the same export, renamed from `customization.webp` — the old name
would have been a lie about which section it serves.

Being the last section changes one thing: the photograph fades in across the crossing into
the closer and then stays, because there is no section after it to cross away to. The ±60px
drift also never completes — its trigger ends at `bottom top`, which is past the end of the
document — so it only travels part of its range. Neither is a defect; both were a fade
in-and-out and a full drift while this sat mid-page.

Layering is explicit — photo on `z-index: 0`, sections and footer on `1`, frame on `5`,
header on `10`. A negative z-index would also work, but only by relying on the body's
background propagating to the canvas; too subtle to rest the page on.

**Kept.** Proposed as a test, approved by the client on 2026-09-02 after seeing it. The
mechanism is generic: any section can take a photographic ground by getting
`data-photo="true"` and its own image — nothing in the JS is specific to one section beyond
the single image url in the CSS.

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

That one pass writes the three colours, the photographic ground's opacity, the morph panel's
shape, and each slide's
`--t`. Two hooks come out of it, both synchronised by construction, for whatever a section
has to do next — an element flying out of the frame, a caption, a video:

| Hook | What |
|---|---|
| CSS | every slide carries `--t`: 0 fully off stage, 1 fully on. Read it from anything inside that slide — `translate: calc((1 - var(--t)) * 40px)`. Slide children are **not** clipped, so they can leave the frame. The curtain's mask is the first consumer; the tab strip's opacity is the second. |
| JS | `section:scrub` on `document`, every step of every crossing: `{ from, to, t }` — the two section elements and 0..1. |

The two ends of a crossing are pinned with `onLeave` / `onLeaveBack`, and `settleSlides()`
sets the slides from geometry at rest, on load and on refresh: `onUpdate` never fires for a
boundary cleared in one jump, which a deep link does. `--t` comes from JS, and the curtain's
mask falls back to `var(--t, 0)` = 0, so with JS off the frame is empty. `--fade` is declared
and unused — the one place a wall-clock fade would go if anything needs one again.

#### The curtain

The frame's content does not cross-fade. Three calls from the client, 2026-09-03:

1. **nothing in the frame sits at a partial opacity on the way** — the arriving picture is
   revealed from the frame's bottom edge upward,
2. the curtain's leading edge carries the frame's own radius on its **top two corners**,
3. whatever falls **under** the curtain takes a **20% black scrim** while it is under there.

The rounded edge is why the two layers **overlap** rather than meet. Butted edge to edge the
rounding leaves two crescents of bare frame at the ends of the line; instead the layer
underneath runs on past the edge by the radius, the curtain covers it, and the crescents show
that layer — scrimmed. Overlap is also what makes the scrim mean anything: without it there
is no "under".

Everything about the shape comes out of `--t`, which both slides already carry: the arriving
slide's runs 0 → 1 and the departing one's 1 → 0, so one edge position falls out of two
values that were already there.

| | |
|---|---|
| arriving (`data-wipe="in"`, and the resting state) | `clip-path: inset(calc((1 - var(--t)) * 100%) 0 0 0 round var(--radius-btn) var(--radius-btn) 0 0)`. Bottom corners left square — the layer's own `border-radius: inherit` rounds them and the visible result is the intersection. |
| underneath (`data-wipe="out"`) | whole box down to the edge **plus the radius**: `inset(0 0 calc((1 - var(--t)) * 100% - min(var(--radius-btn), var(--t) * 100%)) 0)`, and the scrim: `filter: brightness(calc(1 - var(--scrim) * min(1, (1 - var(--t)) / var(--scrim-ramp))))`. |
| z-order | `in` is 2, `out` is 1. Overlap makes the stacking matter, which it did not while the regions were disjoint. |

Two details that are load-bearing:

- **`clip-path`, not a mask** — only a clip takes a radius. It is safe here because these
  layers are leaves (a video, the panes), so clipping them clips nothing else.
- **`min(radius, --t * 100%)`** caps the overlap at how far the edge has travelled from the
  top, so it tapers to nothing as the curtain lands. Without the cap a strip of the old
  picture is left over at the end on a section whose slide is empty and cannot cover it.
- **The roles are cleared at both ends of a crossing** (`role(slide, null)`). A slide that
  came to rest as the one underneath would otherwise keep its scrim and sit 20% dark for as
  long as it was on screen — which happens on every scroll back up, where the arriving slide
  is the earlier one.

A 20% black scrim over an opaque picture is exactly `brightness(0.8)`, which is why the scrim
needs no element of its own — it could not have had one anyway, since `::after` does not
render on a `<video>`.

**The scrim ramps in over `--scrim-ramp`, the first 0.15 of the crossing**, and holds at
`--scrim` for the rest of it. It stepped on at the first pixel of movement to begin with and
the client saw it flick; he asked for "one or two tenths" and 0.15 is the middle. `1 - --t`
is the crossing's progress from the under layer's point of view — its own `--t` counts down.
Measured: brightness 1 at rest, 0.987 at p = 0.01, 0.96 at 0.03, 0.899 at 0.076, 0.8 from
0.15 on.

**The mask goes on the picture layers, not on the slide** — `.stage-frame__video` and
`.frame-pane`, both of which fill the frame's box exactly. A shape cut to that box would
delete anything the slide keeps *outside* it, and two things do:

| | |
|---|---|
| The tab strip | sits below the box (`top: 100%`). It keeps a fade of its own, `opacity: var(--t, 0)` — the one thing in a slide that still fades. Documented exception, not an oversight. |
| The style deck | its cards are thrown out past the frame's edge, and a clip would cut the throw. The deck's gate in `main.js` marks it `data-onstage`, and the curtain stands down for as long as that is true — so it wipes through a crossing and is free at rest. |

A future slide that paints a picture of its own must paint it into an **inner layer** and add
that layer to the curtain's selector list. A `background-image` on the slide itself cannot be
clipped without taking the strip and the deck with it.

**Known gap:** the frame's dashed placeholder outline is still keyed to `data-active`, which
flips at the middle of the header, so crossing away from the hero it can reappear as a
hairline while the photograph is still scrubbing out. Not fixed — the outline is also what
the closer's morph overrides.

### The hero morph — the ground becomes the frame

The one crossing with a move of its own, copied from cash.app and asked for by the client on
2026-09-03: the hero's ground does not cross-fade into the next one, it **shrinks into the
frame**. A fixed layer, `.stage-morph`, starts full-bleed and square and ends on exactly the
frame's box with exactly the frame's radius, scrubbed by the boundary pass like everything
else.

The client's calls, all 2026-09-03 — do not re-litigate:

| | |
|---|---|
| Start | full-bleed, **no** radius. Not a visible inset panel sitting on the hero. |
| End | it does **not** dissolve. It stops on the frame's box and stays there, behind the frame. |
| Gone at t = 1 | `display: none` the moment it lands, not merely covered. Covered was the first attempt and he caught it: the tab strip cross-fades its panes, so mid-swap both are part transparent and the panel showed through the frame. |
| The ground behind | goes smoky white on the **first movement**, not across the gesture — otherwise the first frames of the shrink are graphite on graphite and read as nothing moving. The step is invisible: at t = 0 the panel still covers the screen. |
| Colour | graphite, moved with the hero. It was green; the panel **is** the hero's ground, so the two can only ever be the same colour. |
| The photograph | `hero-full.webp` (Figma `275:53708`, the full square shot) is the panel's own background, **`50% 18% / cover`**, and it does **not** move. As the clip closes, the panel is a shrinking window onto a photograph that stays put. Scaling the picture down with the panel would read as the whole composition being pulled into the frame — a different move, not asked for. |

**Why `50% 18%`, and why the 18 is solved rather than chosen.** The file is square, so
`cover` scales it to the **width**: rendered height = viewport width, and the overflow is
discarded in the proportion the position sets. Measured in the source, 2026-09-03 (decoded to
PPM, rows classified by saturation): the top of his head is at **12.28%** of the height, his
sunglasses at **21.53%**. His face therefore has to land in the band between the header and
the frame's top edge, and head-to-glasses is 9.25% of the rendered height.

| | band | span | at 18% |
|---|---|---|---|
| 1440 | 80 → 233 = 153px | 133px | head 80, glasses 213 — 20px clear of the frame |
| 1920 | 80 → 262 = 182px | 178px | head 85, glasses 262 — **exactly** the frame's edge |

**At 1920 there is no slack and the frame's edge crosses his glasses.** 18 is the best any
position value can do; the full square does not fit that band. The three ways out are all
structural, and all the client's: bring the frame down, crop tighter than the full square
(the old 1.42:1 `hero.webp` put his face at 108px), or `contain`, which fits with 30px spare
but leaves graphite bands down both sides.

**Resolution ceiling.** The node is 2030×2020 but its bitmap is **1254×1254** — Figma
upscales it 1.62× on the canvas, and an @2x export is interpolation, not detail. Shipped at
the native 1254, so the browser scales it up 1.53× to fill 1920 and the picture is
measurably softer than the old `hero.webp` (2236 wide, downscaled there). Only a larger
original fixes it; the encode cannot.

How it is built:

- **The target rect is measured off the frame itself** (`getBoundingClientRect`, re-measured
  on every refresh), so the two cannot drift when `--frame-w`, the header height or the page
  padding change. The radius is measured too.
- **The shape is a `clip-path: inset(… round …)`**, not `inset` and not a `scale`. `inset`
  would lay the element out again on every scrolled frame; a `scale` would squash the
  corners, and a true 24 at the end (32 until 2026-09-03) is the whole point of the move.
- **Layer 0**, the same as the photographic ground: above the ground the body is painted
  with, below the sections' own content (layer 1) so the hero's title and CTA stay on top of
  the photograph, far below the frame (layer 5).
- `setMorph()` is the single writer of both the shape and the panel's presence, and both the
  crossing and `settleMorph()` go through it — so load, refresh and a deep link land on it
  too.

**Known, not fixed:** the ground steps to smoke on the first movement while the **ink** still
lerps white → black across the whole gesture. Around t = 0.4 at 1440 the title's leftmost
~140px have left the panel and sit on smoke in mid-grey. It lasts ~0.3s at the wheel
controller's speed. Two ways out if it shows: hold the ink white until the panel has cleared
the text (lerp it over the tail of the crossing), or take the hero's text out with the panel.
Both are motion decisions — ask.

### The four hero variants

Four grounds for the first screen, switched live from four 18px buttons in the bottom-left
corner. Asked for on 2026-09-03: the client wants them compared in the live page, and the
control small enough to stay out of a screenshot.

| | the morph panel | the frame | the hero's ink |
|---|---|---|---|
| 1 | graphite + `hero-full.webp` at `50% 18%` — the state that stood before | the looping screen recording | white |
| 2 | flat black | `hero.webp` | white |
| 3 | the green-ground photograph, `hero-green.webp` | the looping screen recording | black |
| 4 | the light-grey photograph, `hero-smoke.webp` | the looping screen recording | black |

Variants 3 and 4 were flat colours with the man in the frame for one round on 2026-09-03. The
client replaced both the same day with the photographs he was shot against those grounds in,
built like variant 1 — the man on the panel, the interface in the frame. **Variant 2 is the
only one that puts the man in the frame.**

- **`data-hero` on `<html>` is the whole switch.** CSS reads it for the panel's ground
  (`--morph-bg`) and for which of the frame's two layers shows; the markup ships with `"1"`,
  so a visitor with no JS keeps what the page had before.
- **The ink is not a fifth knob.** White type is unreadable on green and on smoke, so it
  follows the ground. JS writes it on the **hero section's own `data-ink`**, which the
  scrubbed colour pass already reads — so the header, the buttons, the counter-ink and the
  crossing into capabilities all come along for free. Nothing else had to learn about
  variants.
- **The photograph in the frame is `hero.webp`, the tighter 1.42:1 crop**, not the full
  square that backs the panel on variant 1. Client's call: against a 4:3 frame it loses about
  6% off each side instead of a quarter of its height, and 2236 down to at most 720 CSS px is
  the sharpest source on the page. It is a layer of its own (`.hero-photo`) rather than a
  background on the slide, because the curtain has to be able to clip it — see the rule in
  §5's curtain notes.
- **The video is taken out with `display: none` and paused.** `display` alone does not stop it
  decoding, so the controller listens for a `hero:variant` event on `document` and gates
  playback on the variant as well as on `--t`.
- **The boundary pass reads the sections per frame** instead of caching each crossing's pair
  of colours when the trigger is built. Without that, flipping the hero's ink while the page
  is up changes nothing — the crossing keeps painting the ink the page had at load.
  `settleColours()` is the resting-state counterpart, and the switch repaints through it.
- The choice is mirrored to `localStorage`: the demo is shown by scrolling and refreshing, and
  starting over from variant 1 each time would make the four impossible to hold side by side.
- The control is visible only while the hero is the section under the header, off the same
  `section:change` event everything else hangs on (`data-hero-focus` on `<html>`).

**Variant 4's shrink used to be invisible**, and the reason is worth keeping in case a flat
ground comes back. The ground behind the panel steps to the *next* section's colour on the
first movement (see the morph, above), and capabilities is smoke — so a flat smoke panel
shrank against smoke, both `rgb(233, 235, 238)`, and the move only reappeared when the
dashboard wiped into the frame. The photograph fixed it by accident: its floor line and darker
corners give the panel's edge something to show against. Verified at t = 0.5 on 2026-09-03.

Smaller, known: clicking a variant *mid-crossing* repaints the ground from the section at
rest, so on 3 and 4 the ground behind the panel flashes graphite until the next scroll frame.
It self-corrects, and the control is meant to be used on the hero at rest.

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

> A twelve-column page grid on cash.app's model was built and rolled back on 2026-09-02.
> Their architecture only offers symmetric splits of 4/4/4 or 3/6/3: the first makes the
> frame exactly a third, which took it from 720 to 524 at 1920 and the client rejected it;
> the second starves the text columns to 284 at 1440, where the titles need about 380. The
> measurements of their grid are in `WORKLOG.md` under that date. Do not retry without
> settling that trade first.


The page padding is **two tokens**, split on 2026-09-03:

| Token | What | Value |
|---|---|---|
| `--page-pad` | vertical — the sections' bottom padding, and the frame's optical centre | `clamp(76px, calc(4.4vw + 12px), 96px)` |
| `--page-pad-x` | horizontal — the side margin, and therefore what is left for the frame | `var(--col-gap)` |

They were one token until the client asked the laptop side margin to pay for a bigger frame
— keeping them joined would have taken the same off the sections' bottom padding and moved
the frame's centre with it, which nobody asked for. **Anything horizontal takes
`--page-pad-x`; anything vertical takes `--page-pad`.**

**The side margin is now simply the column gap** — the client's call at the end of
2026-09-03, after it had gone 76 → 52 → 40 → 20 across that day and read as too tight. The
margin and the gap are one rhythm and there is no second ramp to keep in step: 52 at 1440,
64 at 1680, and at 1920 it does not bind at all (see below). Note the header sits at 16
(`--header-pad-side`), so on a laptop the bar is 36px inside the content — raised with the
client, not aligned.

`--col-gap` is `clamp(52px, calc(5vw - 20px), 76px)` — 52 at 1440, 76 at 1920. It was raised
+12 at both ends earlier the same day and then trimmed back at the laptop end only, which is
why the ramp is 5vw: from 52 at 1440, a 2.5vw ramp cannot reach 76 at 1920. The two text columns have a floor of `--col-min`
(380px) and the frame takes what is left, capped at 720px.

On a 1920 screen the side margin comes from `--page-max` (1704px), not from the padding —
the container hits its cap before the padding matters. Both numbers have to move together to
change the margin there.

The **header is not on this grid**: it is full-bleed with a 16px side inset, so the logo and
the CTA sit closer to the edge than any section content does. That is deliberate.

The column floor is a composition choice, not a constraint — how much screen the text keeps
before the frame takes the rest. Below ~1830 it is also what sets the frame, since the
columns rest on it and the frame takes the remainder.

**The subtitle fills its column.** It used to set 30% narrower (`max-width: 70%` on
`.section__subtitle`) — 249 at 1440, 291 at 1920; the client dropped that at the end of
2026-09-03 and every subtitle is now the column's full width, 356 and 416. Note what did
*not* change: the columns themselves. The frame is fixed and centred on the screen's axis, so
making the two side columns different widths would take it off that axis and off its slot —
the client ruled that out explicitly and it still stands.

**What actually binds the floor is the hand-set line breaks, not the widest word or run.**
Measured at 1440 on 2026-09-03, stepping the floor down 4px at a time: at exactly **380** the
hero and customization titles set in two lines; at **376 and below** both go to three. Every
other title is unaffected all the way down to 356. The old figure in this file — the widest
hard-broken run, `и интернет магазин`, ~275 at the current 32px xl — is *not* the constraint
and reading it as one is what let the floor be lowered past the edge. Measure the line counts
before touching this number.

At 1920 those same two titles are three lines whatever the floor is: the column is wider
(416) but the xl is 40 rather than 32, and the type wins. So the two-line setting only ever
existed on the narrower screens.

**Titles are set with `text-wrap: balance`**, so lines even out instead of each being filled
to the column edge. It never breaks a word, so it composes with the non-breaking spaces
rather than fighting them.

**Hyphenation is off, deliberately.** It was on while titles set at 44px and a long word
could overflow, and it then did harm: `hyphens: auto` split `бизнесом` across two lines to
even out the rag, when the word fits whole on the next line. Only `overflow-wrap: break-word`
remains, which fires solely for a word too long for its column — no current title is.

Measured:

| viewport | xl | gap | frame | text column | subtitle | side margin |
|---|---|---|---|---|---|---|
| 1440 | 28 / 28 | 52 | **520** | 356 (the floor) | 356 | **52** = the gap |
| 1680 | 36 | 64 | 712 | 356 (the floor) | 356 | 64 = the gap |
| 1920 | 40 / 40 | 76 | 720 (the cap) | 416 | 416 | 108, from `--page-max` |

Re-measured after the margin was tied to the gap on 2026-09-03. It cost the frame 64px at
1440 (584 → 520): the text columns are on their floor there, so every pixel the margin takes
comes out of the frame, twice over. At 1920 nothing moved: `--page-max` sets the margin and the
frame is capped.

**The frame is at its cap from about 1690 up.** Below that it grows at **0.80px per px of
viewport** — with the margin tied to the gap the whole expression collapses to
`80vw - 632`, because the gap is now subtracted four times (two gaps plus two margins) —
and above it, flat 720. The band where it still grows with the screen is 1440–1690. If it
should keep growing past that, the 720 cap is the number to raise, not the gap.

**A consequence worth knowing before touching `--col-gap` again:** below the cap it now
costs the frame **four times** what it used to cost twice. +12 on the gap takes 48px off the
frame at 1440, not 24.

At 1920 nothing any of this touched shows: the side margin there comes from `--page-max`, not
the padding, and the frame is capped. `--page-pad-x`'s own 96 ceiling is now unreachable
below ~2700 and is only a guard.

**Which side pays for the gap depends on the width.** Below the cap the frame is not at its
cap: the two text columns sit on their floor and every pixel added to the gap comes out of
the **frame** — four times over now that the margin is the gap. +12 on the gap took the frame
424 → 400 at 1440 back when it was only twice, which is what made the client ask for it back. At 1920 the cap binds instead, the frame holds 720 and each
**column** pays: 428 → 416, with no title overflowing and no line count changing there.

While the xl was 44 the coupling was tighter still — the widest hard run measured 425 and the
cap had to come down with the gap, 760 → 752 → 720. If the xl goes back up, re-measure before
adding to the gap again.

For anyone tempted to re-tune the frame: it has been 416, 473, 553, 513, 480, 456, 424, 400,
448, 496 and now **544** across this conversation. 400 was not chosen — it fell out of the gap going
up — and 448 is the client's answer to it, 2026-09-03, paid for out of the columns
(`--col-min` 380 → 356) rather than out of the page margin.

**The arithmetic at 1440 leaves no slack.** 1440 = 2 margins + 2 columns + 2 gaps + frame,
so every pixel the frame gains comes off one of the other three, and across 2026-09-03 the
client spent all three: columns 380 → 356, side margin 76 → 40, gap 64 → 52. The frame went
400 → 448 → 496 → 544 on those.

Only the columns cost anything typographic, and they cost it immediately: **380 was the exact
edge** — at 380 the hero and customization titles set in two lines, at 376 and below both go
to three. Trimming the gap and the margin cost nothing at all, because the columns rest on
their floor either way; the price there is only air.

Measured headroom left at 1440: the columns can go to 324 (frame 560 at the old gap) before
the `speed` title breaks to four lines, and the margin can go to 24 (frame 600 measured with
the gap at 40) before the page's content sits level with the header's own 16px inset and the
header stops reading as a separate system. Measure the line counts, do not derive them,
before spending the columns again.

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
| Ярко-зелёный | Bright green | `#A6ED00` | Brand accent: entrepreneurial freedom, growth. **Unused on this page since 2026-09-03** — the hero and the morph panel were its only users. |
| Чистый чёрный | Pure black | `#000000` | Base of the visual system. Sections 4, 7, footer. |
| Глубокий графит | Deep graphite | `#1A1817` | Warm neutral dark. The hero's ground and the morph panel since 2026-09-03, plus the cards in the cases section. |
| Тициановый | Titian red | `#DC200C` | Action energy. **Unused on this page.** |

### Logo

Vendored in `assets/logo/`, pulled from Figma node `196:46920`:

| File | What it is |
|---|---|
| `alphaseller-logo.svg` | Full lockup: mark + "Альфа Селлер", 1037×91. |
| `alphaseller-mark.svg` | Mark only ("A" arrow glyph), 153×102. |

Both ship with hardcoded `fill="black"` — swap to `currentColor` when wiring the navbar
recolor.

**The header carries the full lockup** — mark with the wordmark to its right,
`alphaseller-logo.svg` — since 2026-09-03. It is painted with a CSS mask, so it takes `--ink`
and follows the scroll's colour like everything else on the ground. 20px tall, width derived
from the file's 1037 × 91.13, so 228 × 20 on screen. The 20 is mine — 24 read too large.

The rounded-square badge it replaces is gone, and with it the page's only `corner-shape:
squircle` — nothing uses corner shaping now. `alphaseller-mark.svg` stays in the repo.

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
| 1 — hero | `assets/video/hero.mp4` + `assets/images/hero-poster.webp` | `247:42060` | screen recording, on a loop. See below |
| 1 — hero, **the morph panel's ground** | `assets/images/hero.webp` | `196:53708` | 2236×1578 (1.42:1). Not in the frame — it backs the full-bleed morph panel, see §5. Re-pulled 2026-09-03 and byte-for-byte the same shot, so the file in the repo was already it |
| 1 — hero, **variant 4's panel ground** | `assets/images/hero-smoke.webp` | — | the same shoot on a light-grey studio ground, 1.79:1. Client-supplied PNG, 2752×1536, `cwebp -q 88 -resize 2560 0`, 96 KB. Same `center / cover` as variant 3's |
| 1 — hero, **variant 3's panel ground** | `assets/images/hero-green.webp` | — | the man against the brand green, 1.79:1. Client-supplied PNG, 5504×3072, `cwebp -q 88 -resize 2560 0`, 220 KB. Wide enough to be *downscaled* at 1920 rather than blown up, which is variant 1's known softness. `center / cover` is enough here — a 1.79 source against a 1.6-2.1 viewport crops a little off whichever axis is tighter, unlike the square, which needed a solved vertical position |
| 1 — hero, unused | `assets/images/hero-street.webp` | `265:39107` | a street shot that was in the frame for one round on 2026-09-03. 4096×2286 JPEG, centre-cropped to 4:3 and resized in one `cwebp -q 82 -crop 524 0 3048 2286 -resize 1440 1080` pass, 91 KB. Unwired, kept |
| 2 — capabilities, `promotion` pane | `assets/images/capabilities-promotion.webp` | `206:62480` | node is named "Продвижение — 4×3 / content". 1118×838.5, @2x → 2236×1677, cwebp **`-lossless`**, 172 KB |
| 2 — `orders` pane | `assets/images/capabilities-orders.webp` | `209:35586` | same size and export, 188 KB. Re-pulled once after the client edited the node — the file name stays, so a re-pull is a byte swap and nothing else |
| 2 — `logistics` pane | `assets/images/capabilities-logistics.webp` | `223:37237` | same size and export, but **`-q 90`**, 167 KB |
| 4 — customization, deck card | `assets/images/customization-fashion.webp` | `275:39469` | POLENE, a clothes-and-bags shop. Raw fill 2448×1740 → cropped to 4:3, scaled to 1440×1080, `cwebp -q 90`, 84 KB |
| 4 — deck card | `assets/images/customization-care.webp` | `275:39470` | "The Department of Bed Intentions", self-care. Same treatment, 116 KB |
| 4 — deck card | `assets/images/customization-furniture.webp` | `275:39472` | a furniture shop. Same treatment, 74 KB. **Supersedes** the first cut of this deck — three AVIF screenshots the client sent on 2026-09-03, ~1080×600, dropped the same day for these |
| 4 — deck ground | `assets/images/customization-fashion-ground.webp` | `275:39455` | the photograph that pairs with the fashion card. Node export 1222×824 → 900×606, `-q 60`, 34 KB |
| 4 — deck ground | `assets/images/customization-care-ground.webp` | `275:39458` | pairs with the care card. 900×600, `-q 60`, 19 KB |
| 4 — deck ground | `assets/images/customization-furniture-ground.webp` | `275:39467` | pairs with the furniture card. 900×600, `-q 60`, 12 KB |
| 7 — growth tile, ads | `assets/images/growth-ads.webp` | `279:54331` | 3D Я + VK. @3x export, keyed off Figma's `#1E1E1E` canvas, `cwebp -q 90 -alpha_q 100`, 25 KB |
| 7 — growth tile, loyalty | `assets/images/growth-loyalty.webp` | `279:54334` | 3D heart. Same treatment, 34 KB |
| 7 — growth tile, bloggers | `assets/images/growth-bloggers.webp` | `276:54324` | 3D percent sign. Same treatment, 35 KB |
| 7 — growth tile, partners | `assets/images/growth-partners.webp` | `279:54335` | 3D figure and plus. Same treatment, 28 KB |
| 3 — speed | `assets/images/speed.webp` | `276:54234` (tablet inside it, `276:54238`) | the catalogue on an iPad. Instance export @3x, 2154×1641 (1.31:1). Figma paints its own `#1E1E1E` canvas behind the device, so the export was keyed on that colour and flattened onto black (`ffmpeg colorkey` + `overlay` on `color=black`) — the key also blackens the `#1E1E1E` text inside the screenshot, which at 520px wide is invisible. `cwebp -q 90`, 127 KB. **`contain`**, not cover |
| 5 — marketplaces | `assets/images/marketplaces.webp` | `206:60376` | a woman in red on a street of falling paper. Node export 2298×1635 (1.41:1) → `cwebp -q 82 -resize 2236 0`, 2236×1591, 163 KB. Against the 4:3 frame `cover` trims about 6% off each side |

| 5 — marketplaces, **the conversion chip** | `assets/images/marketplaces-conversion.webp` | `279:55403` | the product's own card — «Конверсия в заказ», 12,92 %. Not the node export: that bakes Figma's `#1E1E1E` canvas into the rounded corners. `download_assets` returns the **raw fill** as well, 384×179 with the rounding already in its alpha, and that is what shipped — `cwebp -lossless`, 4.2 KB, smaller than `-q 90` at 5.2 |
| 5 — marketplaces, **the status chip** | `assets/images/marketplaces-statuses.svg` | `279:55414` | the order-status list, five rows, the first badge green. Exported as **SVG** and the one baked `<rect fill="#1E1E1E">` deleted — the only edit, asserted in the script. Text comes as outlines, so it carries the product's UI font without the page loading one, and stays crisp at any frame width. 58 KB uncompressed, and it is paths, so it gzips hard |

| 5 — marketplaces, **the Ozon icon** | `assets/images/marketplaces-ozon.webp` | `284:55477` | the app icon, off the frame's right edge. Its own **raw fill**, 720×720 with the squircle corners already in the alpha, `-resize 192 192 -q 90 -alpha_q 100`, 13 KB — lossless was 49 |
| 5 — marketplaces, **the Megamarket icon** | `assets/images/marketplaces-megamarket.webp` | `284:55478` | the same, below the frame's bottom edge. `-resize 240 240`, same settings, 8.8 KB against 39 lossless |

**Getting a clean export out of Figma.** Three of these assets fought the same thing: a node
export composites Figma's `#1E1E1E` canvas, so anything with rounded corners or a soft edge
arrives matted onto grey. The growth tiles and the speed screen were keyed on that colour
after the fact. There are two cleaner routes, both used above and both worth trying first:

- `download_assets` also returns `rawImages` — the original uploaded bitmap, no canvas, alpha
  intact. Good when the node is a picture (the conversion chip, both app icons). A node with
  several fills returns several, at different resolutions: take the largest, and check it is
  the composed artwork rather than one layer of it — for these icons every one of them was
  the whole icon, 93% opaque, which is a squircle's share of its square.
- `defaultFormat: "svg"` puts the canvas in as a single full-bleed `<rect>` that can be
  deleted outright, and the rest is clean vector. Good when the node is UI (the status chip).
- `get_screenshot` with `contentsOnly: true` also renders transparent, but only at the node's
  natural size — no upscale — so it is a check, not a source.

`209:35586` was on the `promotion` pane first; the client then said that screen is
**Заказы** and supplied `206:62480` for Продвижение, so the file was renamed, not
re-exported.

**Note on the logistics screen:** its own title is «Товары и остатки», not logistics. The
client assigned it to that tab anyway. Flagged — the tab may want renaming.

One file per pane, named after it. `206:58220` was the previous cut of the same screen and
is superseded; `204:51472` before that was the 1.42:1 one.

### The hero video

The hero frame holds a screen recording of the dashboard, looping, silent — Figma node
`247:42060`, "Built-in Retina Display 1". **The video cannot be pulled out of Figma:**
`download_assets` returns only a poster frame for a video fill, and `export_video` refuses
with "Export root must be a top-level frame. Sub-clips cannot be exported directly" — it
renders Figma timelines, not video fills. The client supplied the file by hand.

| | |
|---|---|
| Source | 1108×720, 60fps, 14s, H.264, 1.93 MB, no audio track |
| Shipped | `assets/video/hero.mp4` — 1000×650, 30fps, 14s, x264 `-crf 30 -preset slow -tune animation`, `+faststart`, **933 KB** |
| Poster | `assets/images/hero-poster.webp` — its own first frame, cwebp `-q 80`, 40 KB |

Why those numbers: the frame renders at 424×318, so ~848×636 at 2× — 1000px wide leaves
headroom and nothing more. 60 → 30fps costs nothing on a UI recording and saves most of the
bytes. `-crf 32` was 720 KB and still legible at that scale; 30 is one notch of headroom on
the page's most-seen asset. **VP9 was tried and dropped** — 2.0 MB at `-crf 36` against
933 KB for H.264 on the same input, so there is no webm and no `<source>` list: H.264 in MP4
plays everywhere.

The markup carries `autoplay muted loop playsinline preload="auto"`, so it runs with no JS.
JS only ever stops it: paused off stage (via the slide's `--t` gate, edge-triggered) and
outright under `prefers-reduced-motion: reduce`, where the poster stays instead.

`object-fit: cover` crops it like a background: 1000×650 is 1.54:1 against a 4:3 frame, so
about 74px comes off each side at source scale. On this recording that eats into the left
column of the UI — **raised, not resolved**; `contain` or a 4:3 recrop in Figma are the
alternatives.

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

### The style deck

Section 4 holds a deck of three shop screens in the frame — Tinder, thrown by hand. The
front card *is* the frame: same size, same radius — 24 since 2026-09-03. Everything about it is the client's
call on 2026-09-03, chosen against the alternatives offered:

- **By hand only.** No 5s carousel like the tabs, and no buttons under the frame.
- **`cover`, not letterboxed.** The screens are 1.41:1 against the frame's 4:3, so 5% of
  each one's width is cropped away. This was the reason for a decision that no longer costs
  anything: the first set of screens was 16:9 and lost a quarter of its width, and he picked
  cropping over fitting the whole screen inside the card.
- **Each card is paired with a ground.** The client supplied the images as three pairs in
  Figma section `275:39451` ("tinder"): a photograph and the shop screen that belongs with
  it — a fashion shoot with a clothes shop, a skincare shot with a self-care shop, a room
  with a furniture shop. Swiping the deck changes the photograph behind the whole screen.
  The pairing lives in the markup, in `data-card` on both the card and its ground layer;
  nothing in the JS knows the names.
- **A stack, not a fan.** Each card behind sits 28px lower and 5% smaller, with no
  rotation at all. A fan of ±3.2° was built first and he dropped it the same day: "не веер,
  а как у тиндера, неактивные меньше и ниже". Watch the interaction between the two
  numbers — shrinking a card pulls its own bottom edge up by half the height it loses, so
  the drop has to beat that before anything peeks out at all. Measured at a 584×438 frame,
  the ledges under the front card are 17px and 34px.
- **The cards behind are veiled, not faded.** 20% black over each of them, `--veil` 0 in
  front and 1 behind, and `opacity` on a card now means the dissolve of a throw and nothing
  else. Fading them 35% a step was the first cut and he rejected it: "убираем приглушение
  неактивных вариантов по опасити — шумит. можем на них кидать оверлей 20% черного вместо
  этого." The reason it read as noise is that a faded card lets the section's ground through
  a screenshot that is mostly white; the overlay darkens the same pixels instead.
- **The stack deals out on arrival.** The cards behind start tucked under the front one and
  slide down into their slots, 0.55s on `power3.out`, staggered 0.08s. Client asked for it
  on every entry ("при каждом заходе"), so it hangs off the slide's gate, and it is skipped
  under `prefers-reduced-motion` — the stack is simply placed there.
- **Two round buttons under the frame.** Client's ask on 2026-09-03: round, an arrow, a
  stroke. They are a secondary button in the round — the site's control height, a pill
  radius, a 1px inset ring in the ink, and they fill with the ink on hover while the arrow
  swaps to the counter-ink. One arrow path in the markup, mirrored in CSS for the other
  direction.

  They hand `toss()` a **velocity**, not a distance — 1.2 px/ms, in the middle of a hand's
  0.7–2 — so a click and a flick go through exactly the same physics. A press while a card
  is in the air does nothing.

  Their drop has to clear the stack rather than the frame: the third card's ledge hangs
  29–34px below the frame's bottom edge across the frame sizes this design allows, so the
  drop is the tab strip's plus 40. And they live **inside** `.style-deck`, so the deck's
  gate makes them `inert` off stage along with the cards, with no gate of their own. They
  fade in as part of the arrival rather than switching on: controls that appear at full
  strength next to a stack that is still dealing read as a different screen.
- **The front card twitches on arrival.** Nothing else on the page says it can be taken, so
  0.35s after the slide lands it pulls 18px left, 18px right and settles — 1.1s in all, on
  the drag's own rotation mapping so it is the gesture a hand would make. His ask, and it
  runs on every arrival: the visitor may reach this screen first on the way back up. It is
  the one part of the deck that goes under `prefers-reduced-motion: reduce` — a hint is
  decoration, the drag is the content. A hand on the card kills it outright.

**The travel is integrated; only the dissolve is on a clock.** Two cuts were wrong before
this one, both caught the same day, and the reason is worth keeping:

1. `power2.in` on the way out — an ease that *starts from a standstill*. A card dragged
   aside and released came to a halt under the hand and then accelerated sideways on its
   own. "Антифизично".
2. Then an ease-**out** whose duration came from the release speed. The acceleration was
   gone, but a tween still has to cover the whole distance out of the frame within its
   duration, so a slow release handed off to an exit faster than the hand.

Both faults come from treating the card's *travel* as the thing that has to complete. It
does not. What has to complete is the card leaving the deck, and that is the dissolve. So:

- **Position is integrated per frame** off the release velocity against exponential
  friction — `v *= e^(-dt/tau)`, `tau` 190ms — on a `gsap.ticker` callback, and is never
  told where to end up. The card carries about `v0 × 170` px past the release point.
- **Opacity is a fixed 0.42s** `power1.in` tween, whatever the card is doing. It is the one
  thing that decides the card is gone, and its `onComplete` puts the card at the back of
  the deck, invisible, then fades it up into its slot.
- Measured, at a 424px frame: released at 0.375 px/ms it travels **63px** and dissolves
  essentially where it stands; flicked at 1.6 px/ms it travels **262px** in the same 0.42s.
  The client asked for exactly this shape — "если я увел карточку и оставил сбоку — она на
  месте растворится. если я выкинул её драгом — улетит растворяясь."
- Rotation needs nothing of its own: in flight it keeps the drag's own mapping,
  `x / width × 12°`, so it goes on turning as it goes on moving.
- The drag's speed is a smoothed reading (exponential average, 0.7 on the newest sample) in
  px/ms. One raw frame is far too jumpy to throw a card with, and a heavier average would
  read a pause before release as a throw.
- **Two ways to send a card.** 26% of the frame's width, or 0.7 px/ms in the direction the
  drag is already going. A flick that covers 40px and stops is not a throw; one that covers
  40px and is still moving is.
- **The next card answers the drag.** It rises 60% of the way towards the front slot —
  position, scale and opacity together — as the front card is pulled past the catch
  distance, and sinks back with it if the throw does not happen. An undecided card returns
  on `power3.out` over 0.5s, and the whole stack goes home in the same pass. Once a card is
  let go of, the deck closes up *while* it is still dissolving on top of it: the card leaves
  the order immediately, keeps the top of the pile, and `layout()` skips it until it lands.

A card in the air blocks a new drag until it dissolves — 0.42s. With three cards nobody has
asked to swipe faster than that; allowing it would mean tracking several cards in flight.

**A thrown card rejoins the deck at the back, so it never runs out.** Mine, not his — three
cards would otherwise leave an empty frame after three throws.

**The blurred ground.** `.deck-ground` is a fixed layer on z-index 0 — the same layer the
closer's photograph uses, and the two never show at once. One child per card, cross-faded on
a 0.5s wall-clock transition, because a swipe is a discrete event with no scroll to scrub it
against; the layer's *own* opacity is written by JS against the scroll, like every other
value a section change drives. Three things about it are deliberate:

- `--deck-blur` is **0px right now** — the client asked to see the grounds sharp on
  2026-09-03 ("давай ради эксперимента снимем блюр с фонов"). It was 32px, his own floor,
  and it is a variable so this is one line either way. The two states want different
  sources, though: blurred, the grounds were 900px at `-q 60` (12–35 KB); sharp, they are
  1920px at `-q 78` (62–194 KB), because the blur was what made the small ones look fine.
- A blur destroys detail, so a blurred ground needs no resolution — and note the blur costs
  the same either way, since the browser blurs the rendered layer and not the file. The
  sources are re-exported whenever the blur is turned on or off; the 2x node exports out of
  Figma are what both sets come from.
- Each layer is inset by twice the blur radius and the container clips it. A blur samples
  past its element's edges, so without that there is a soft band around the viewport.
- `--deck-scrim` is 15% black, added on 2026-09-03 — "чуть ярковаты сейчас". It is one
  `::after` over all three layers rather than one per layer, because it has to hold steady
  through a cross-fade: two stacked 15% overlays would darken the middle of every swipe.

**The card sources are now @2x for the frame's cap.** 1440×1080 against a 720px frame; the
first cut of this deck topped out at 836×627 and was soft on a big screen, which is why
these were asked for.

**No shadow and no hairline between the cards.** The dimmed ledges read against this
section's black ground on their own — the dimming is plain `opacity`, so on black it lands
as darkening. On a light ground it would land as washing out instead, and the stack would
need something else — flagged, not decided.

The transforms are written by JS only (`main.js`, section `the style deck`); `base.css`
sets none. A card being dragged has to be moved from the same place its resting position
comes from, and two writers on one `transform` is how a card ends up stuck mid-throw.

Like the tabs, the deck is gated by its slide's `--t`: `inert` while the slide is off
stage, because a slide at opacity 0 still hit-tests. Both gates now register themselves in
one `gates` map that `stage()` calls — that is the only place a slide learns it is on
stage, so a crossing, a jump, a deep link and a refresh all go through it.

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
| `xxl` | Hyper Medium | 56 / 56 at 1440 → 64 / 64 at 1920 | normal | The closer heading — the only one left since the cases went back to `xl` on 2026-09-03 |
| `lg` | Hyper Regular | 18 / 24 at 1440 → 22 / 28 at 1920 | `0.01em` | The growth tiles' text, and nothing else yet. Added 2026-09-03. **The sizes are the client's** ("18 на 1440 и 22 на 1920"); the leading is mine |
| `xl` | Hyper Medium | 28 / 28 at 1440 → 40 / 40 at 1920 | normal | Section titles |
| `md` | Hyper Regular | 14 / 18 at 1440 → 18 / 24 at 1920 | 1% (`0.01em`) | Everything else |

"Hyper" is the `wdth 87` width; "Medium" is `wght 500`, "Regular" is `wght 400`. In CSS:
`font-stretch: 87%` plus the weight.

**Every style scales, on the same 1440–1920 window, and is held flat outside it.**

| Style | Size clamp | Leading clamp | 1440 | 1920 |
|---|---|---|---|---|
| `xxl` | `clamp(56px, calc(32px + 1.6667vw), 64px)` | = size | 56 / 56 | 64 / 64 |
| `xl` | `clamp(28px, calc(2.5vw - 8px), 40px)` | = size | 28 / 28 | 40 / 40 |
| `md` | `clamp(14px, calc(2px + 0.8333vw), 18px)` | `clamp(18px, 1.25vw, 24px)` | 14 / 18 | 18 / 24 |

**`xl` no longer shares xxl's ramp.** Its laptop end came down 36 → 32 → 28 across
2026-09-03 while 1920 stayed 40, so it climbs at 2.5vw against xxl's 1.6667vw and the gap
between the two sizes is much wider on a laptop (28 against 56) than at 1920 (40 against 64).
Measured 2026-09-03: 28 at 1440 and below, 29.8 at 1512, 34 at 1680, 40 at 1920.

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
| Corner radius — logo square, frame, slides | **24** (`--radius-btn`) — was 32 until 2026-09-03 |
| Corner radius — the growth tiles | **36** (`--radius-card`, `--radius-btn` + 12) — was 44 |
| Corner radius — buttons and tabs | full pill (`--radius-pill: 999px`) |
| Button side padding — both sizes | 20 (`--btn-pad-x`) |

**Two shapes, three radii.** The frame, its slides and the logo square are rounded at **24**
(`--radius-btn`); the tiles at **36** — the client asked for +12 on that one element on
2026-09-02, so it carries its own `--radius-card: calc(var(--radius-btn) + 12px)`; the buttons
and the tabs are full pills (`--radius-pill`). `--radius: 12px` survives only as the base
`--radius-btn` is derived from; nothing uses it directly.

**32 → 24 on 2026-09-03**, client: "давай скругления на рамке сделаем чуть поменьше". He was
given 28 / 24 / 20 and took 24, and chose to keep the +12 relation rather than pin the tiles
at 44 — so they went with it, 44 → 36. Changed at `--radius`, not at `--radius-btn`, so the
"base × 2" structure stands. Everything that follows the frame followed for free: the slides
and the picture layers inherit it, the curtain cuts its rounded leading edge on the same
token, and the morph panel measures the frame, so it lands on a true 24.

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

### Pushing — must go out as `levalovushka`

Git Credential Manager on this machine holds a second GitHub account, `llleva`, which has no
write access here; it was answering first and every push came back
`403 Permission to levalovushka/alphaseller.git denied to llleva`. Fixed **repo-locally** on
2026-09-02 by pointing this repo at the `gh` CLI, which is already logged in as
`levalovushka`:

```
git config --local credential.helper ""
git config --local --add credential.helper "!gh auth git-credential"
```

The empty value first resets the inherited helper list, so GCM is not consulted for this
repo. Nothing global changed and no token was ever typed or stored — `gh` hands its own
keyring credential straight to git. Verify with

```
printf 'protocol=https\nhost=github.com\n\n' | git credential fill | grep '^username='
```

which must print `username=levalovushka`. To undo: `git config --local --unset-all
credential.helper`. If other repos need the same, `gh auth setup-git` does it globally.

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
| `206:60376` | Street photograph, woman in red — the marketplaces frame. |
| `279:55320` | Styled mockup of the **marketplaces** section — the picture with two product cards around it. Its own left and right text is section 3's and is to be ignored (client, 2026-09-03). `279:55403` is the conversion card, `279:55414` the status list. |
| `279:54342` | Styled mockup of the growth tiles — red bank tile, 3D stills on the others. `279:54330` is the Alfa "А". |
| `276:54234` | Full mockup of the speed section — tablet between the two text columns. `276:54236` is the tablet's own frame, `276:54238` the iPad instance that was exported. |
| `275:39451` | Section "tinder" — the style deck's six images, as three pairs. Children `275:39475` / `39476` / `39477` are the pairs; in each, the upper rectangle is the ground and the lower one the shop screen. |
| `275:39455` / `275:39469` | Pair 1 — fashion shoot ground, POLENE shop screen. |
| `275:39458` / `275:39470` | Pair 2 — skincare ground, "Bed Intentions" shop screen. |
| `275:39467` / `275:39472` | Pair 3 — furnished room ground, furniture shop screen. |

`get_metadata` on `1:49642` and on `196:46923` overflows the MCP transport. Read frame by
frame; ask the client for direct links.

### The hero frame is empty

The photograph that filled the hero slide was taken off the first screen by the client on
2026-09-02. `assets/images/hero.webp` **stays in the repo** — he wants it again later, just
not there. The slide is back to the dashed empty frame; putting it back is one
`data-filled="true"` and one `background-image`.

## 11. Verifying in the browser

Five traps, all hit more than once:

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

- **A hidden preview pane has no viewport.** `innerWidth` and `innerHeight` come back 0, and
  the layout does not merely shrink — `--frame-w` resolves to a negative number, so the
  frame is 0×0 and the sections take their content height. Every measurement is then a lie.
  Emulate a size first (`resize_window` to 1440×900; the frame is 424×318 there, 720×540
  only past ~1830) and re-measure. It also pauses `requestAnimationFrame`, so nothing
  animates on its own: drive GSAP by hand with `gsap.ticker.lagSmoothing(0)` and repeated
  `gsap.ticker.tick()` in a busy loop, and prime it with two ticks after any `await` or the
  first tick swallows the whole pause as one frame and jumps the tween to its end.

- **A hidden pane does not repaint after a scroll.** Screenshots come back solid black
  anywhere but the top of the document, however correct the geometry reads. To look at
  something that lives further down, bring it to `scrollY` 0 instead — for a frame slide,
  set its `--t` to 1 inline and the hero's to 0. The ground behind it will be the hero's,
  not its own.

- **Trusted input cannot be delivered to a hidden pane at all** — `computer{action:
  "scroll"}` times out. Synthetic events do reach the page's own listeners, which is enough
  to exercise anything that moves the page itself rather than asking the browser to:
  `new WheelEvent('wheel', {deltaY, cancelable: true})` for the scroll controller, and
  `new PointerEvent(...)` for the deck with `Element.prototype.setPointerCapture` stubbed to
  a no-op (a synthetic `pointerId` has no active pointer, so the real one throws). Space the
  moves out with real time if the code reads velocity.

- **ScrollTrigger is starved inside a synchronous tick loop.** It updates off native scroll
  events, which are not dispatched while JS holds the thread, so the ground colour and the
  slides look frozen mid-measurement even though the scroll position is moving. Yield, or
  call `ScrollTrigger.update()` explicitly, before reading anything it drives.

## 11. Open questions

- Type scale — client is deciding.
- Which screen / video / people go into which section frame — later; frames stay empty.
- Date of the board meeting — unknown.
- Font license for production — unresolved.
- White ink over the blurred grounds: 15% black went on at the client's request, which
  helps, but the care and furniture photographs are still beige under it. Whether that
  needs more is his call — `--deck-scrim` is the one number to turn.
