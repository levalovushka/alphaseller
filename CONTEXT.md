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
| 2 | Key capabilities | White `#FFFFFF` |
| 3 | Speed | Smoky white `#E9EBEE` |
| 4 | Customization | Black `#000000` |
| 5 | Marketplaces | Smoky white `#E9EBEE` |
| 6 | Audience | White `#FFFFFF` |
| 7 | Closer | Black `#000000` |
| — | Footer | Black `#000000` — reads as a continuation of the closer |

**Red is not used on this page at all** (for now). Both dark sections and the footer use
pure `#000000`; `#1A1817` is unused for now.

### Copy — v1, from the client, 2026-09-02

Every section carries exactly three strings: title, subtitle, CTA label.
**Neither titles nor subtitles carry a trailing period** — the client removed them. A
period inside a subtitle (section 5) stays.

| # | Title | Subtitle | CTA |
|---|---|---|---|
| 1 | Одна платформа на всю онлайн-торговлю | Продавай больше, управляй с легкостью, расширяй аудиторию с единой платформой для управления электронной коммерцией | Начать бесплатно |
| 2 | Весь цикл продаж в одном кабинете | Свой сайт, приложение, аналитика, управление рекламой и логистикой, деньги, остатки и отзывы | О платформе |
| 3 | Свои каналы продаж за один день | Онлайн-витрины без подрядчиков, с привязкой к Telegram и Max — рабочие, красивые и с твоей наценкой | Сделать сайт |
| 4 | Уникальное, как твой бизнес | Выбирай из стильных шаблонов и докручивай, пока не будет идеально подходить под твой вкус | Посмотреть шаблоны |
| 5 | Управляй продажами на маркетплейсах | Даём сводную аналитику, картину по заказам, остаткам, логистике. Помогаем выбрать самые продающие карточки товаров | Подключить |
| 6 | Смелые уже с нами | Огромные корпорации и небольшие бизнесы уже вернули контроль в свои руки с нашей платформой | Все кейсы |
| 7 | Продавай по своим правилам | Верни контроль над бизнесом и заставь его работать на твою мечту | Начать бесплатно |

- Sections 1 and 7 share the CTA `Начать бесплатно`, and the header carries it too. **This
  repetition is intentional** — do not "fix" it.
- Copy is v1 and will change. Keep every string in one place in the markup so swapping is
  cheap.

### Header

- Logo (Alpha Seller only — no Alfa-Bank lockup).
- Links: `продукты`, `тарифы`, `крупному бизнесу`, `примеры`, `блог`.
- Button: `начать бесплатно`.
- **Full-bleed**, not inside the page container: 16px from the top, 20px from both edges.
  The height follows from the padding plus the 52px controls; nothing fixes it — it lands
  at 88px. The bottom padding (20px) is still a placeholder.
- **The nav links sit on the screen's centre**, not in the middle of the space left over
  between the logo and the button. Implemented as a `1fr auto 1fr` grid.
- The ground is light but sections 1, 4 and 7 are green/black. **The navbar must recolor
  itself against the section currently under it** (or an equivalent solution). Real
  requirement — plan for it in the section markup.

### Footer

Element inventory taken from Figma node `196:46921` — **inventory only, ignore its
styling**. No red panel, no pills: black background, continuous with the closer.

- Column 1: `support@alfasell.com`, `© Альфа-Селлер, 2026`, plus social icons
  (Telegram, Instagram, VK, email).
- Column 2: `продукты`, `тарифы`, `крупному бизнесу`, `примеры`.
- Column 3: `блог`, `база знаний`, `реферальная программа`, `о компании`.
- Column 4: `Публичная оферта`, `Политика конфиденциальности`,
  `Согласие на обработку персональных данных`.

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
   the header changes. Slides are empty until the client supplies screens, video and people.
3. **The ground colour lives on `<body>`, not on the sections.** JS copies the active
   section's `data-theme` onto the body and CSS cross-fades `background-color` over
   `--fade`. Sections are transparent — otherwise the colour arrives as a hard edge sliding
   up the screen instead of a fade. The header ink, the frame's fill and the slide swap all
   use the same `--fade` (0.9s, `ease-in-out`).
4. The frame fades out across the footer's entrance, scrubbed to the scroll.
5. Each section's title, subtitle and CTA reveal once on entry (rise 24px + fade, 0.8s,
   staggered). The trigger is the **title**, not the section — sections are a viewport tall
   with centred content, so a section-anchored trigger fires a full screen too early.
   Skipped under `prefers-reduced-motion: reduce`.

**The header does not hide on scroll** — tried, dropped at the client's request. It stays
put; only its ink changes. No custom cursor, no magnetic buttons.

### The `section:change` event

Every switch fires a `CustomEvent` on `document`, so anything later — filling a slide,
starting a video, cueing a caption — hooks on without touching `main.js`:

```js
document.addEventListener('section:change', (e) => {
  e.detail; // { id, theme, ink, isSection, ground }
});
```

`id` is the section's element id (`'footer'` for the footer), `theme` and `ink` are the
ground's own data attributes, `isSection` is false only for the footer.

### The three-column stage

`--col-min` (400px) is a hard floor on the two text columns; the frame takes what is left,
capped at 760px. **This floor is measured, not guessed:** the longest unbreakable word in
the copy is `маркетплейсах` at 391px in the xl style, and at a 340px floor it ran out of its
column and collided with the frame on a 14" MacBook. Re-measure if a longer word ever lands
in a title. Resulting frame widths: 416px at 1440, 488px at 1512, 760px at 1920.

## 6. Content

- **All copy comes from the client.** Never invent product copy — ask. v1 is in §4.
- No stats / rates / "N million users" blocks on this page.
- Product screens exist (see §7) and other graphics exist and will be supplied later.

## 7. Brand

### Colors (fixed)

| Name (RU) | Name (EN) | HEX | Role |
|---|---|---|---|
| Чистый белый | Pure white | `#FFFFFF` | **Page ground.** Contrast, crisp compositions. |
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
| `xl` | Hyper Medium | 44 / 44 | normal | Section titles |
| `md` | Hyper Regular | 18 / 24 | 1% (`0.01em`) | Everything else |

"Hyper" is the `wdth 87` width; "Medium" is `wght 500`, "Regular" is `wght 400`. In CSS:
`font-stretch: 87%` plus the weight. Note `h1`/`h2` default to bold — the title weight must
be forced back to 500.

### Control sizes (fixed by the client)

| Element | Size |
|---|---|
| Logo — **mark only, no wordmark**, in a rounded square | 52×52 |
| Header CTA button | 52 high |
| Section CTA buttons (under the subtitle) | 44 high |
| Corner radius — logo square, frame | 16 |
| Corner radius — buttons | 32 (`--radius-btn`, twice the base) |
| Button side padding — header | 20 |
| Button side padding — sections | 22 |

Two tokens: `--radius: 16px` for the logo square and the frame, `--radius-btn` at twice that
for the buttons. 32 exceeds half of both button heights (44 and 52), so browsers clamp it —
the buttons render fully rounded.

The logo square is a **squircle with a fallback**: `border-radius` for Safari and Firefox,
`corner-shape: squircle` inside `@supports` for Chrome 139+. It applies to **everything
rounded** — the logo square, both buttons and the frame.

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

`get_metadata` on `1:49642` and on `196:46923` overflows the MCP transport. Read frame by
frame; ask the client for direct links.

## 11. Open questions

- Type scale — client is deciding.
- Which screen / video / people go into which section frame — later; frames stay empty.
- Date of the board meeting — unknown.
- Font license for production — unresolved.
