# Kit reference

The kit is what scenes are drawn with and steps are written with. It lives in `src/components/deck/kit/`, and everything below is imported from `@/components/deck/kit` unless a row names another file. For how the pieces fit together, read [how-a-deck-works.md](how-a-deck-works.md) first.

Three things to know before the tables:

- Every part takes an `id`. The part puts it on its element as `data-build`, and that is the key a step moves. Some parts add keys of their own under yours, shown in the tables.
- Coordinates are stage pixels on the 1920 by 1080 stage. `at` is a `Box` (`{ x, y, w, h }`, made with `box()`) or a `Point` (`{ x, y }`), as the row says.
- Many parts are drawn and filled through CSS custom properties: `--d` (how much of a line is drawn, 0 to 1), `--k` (how full, 0 to 1), `--pass`, `--fail` and `--hold` (a cell's state). The verbs move these, so you rarely set them by hand.

## Kit parts

### Stage and text

| Part | What it draws | Moves it takes | Key props |
|---|---|---|---|
| `Plane` | A world's surface: one SVG for marks, HTML on top, and an optional second SVG over the HTML | The camera moves it | `size` (defaults to `STAGE`), `marks`, `over`, `children` |
| `Part` | A group that moves as one. Given an `origin` it can also move and scale about that point | `show`, `hide`, `to`, `spread`, `gather` (through `--x`, `--y`, `--s`) | `id`, `origin`, `children` |
| `Ghost` | The same as `Part`, by another name | As `Part` | As `Part` |
| `SetText` | Lines of type, each rising out of a mask. A `title` draws a short green rule under its last line | `lines`, `tell`, `hide` | `id`, `x`, `y`, `lines`, `size` (`display` 108, `large` 96, `title` 72, `quote` 64, `medium` 48, `text` 32), `rule` |
| `Block` | A block of HTML at a box: a caption, a paragraph, a figure | `show`, `rise`, `hide`, `to` | `id`, `at` (Box), `className`, `children` |
| `Counter` | A number that counts up, with an optional label. Adds the key `<id>.box` | `count` | `id`, `x`, `y`, `width` (digits), `label`, `size` (`display` 108 or `figure` 56) |
| `TypeText` | A line that types itself out | `type` | `id`, `x`, `y`, `text` |
| `Story` | A slide's story lines, A and B, in a band under the title. Keys from `storyKeys(id, n)`: `<id>.a`, `<id>.b` | `tell` | `id`, `band` (`one`, `two`, `three` or `foot`), `lines`, `starts` |

### Marks and figures

| Part | What it draws | Moves it takes | Key props |
|---|---|---|---|
| `Node` | A named box: a system, a file, a place work passes through | `show`, `rise` | `id`, `at` (Box), `label`, `sub` |
| `Connector` | A line between two boxes, with an arrowhead unless `head={false}` | `draw` | `id`, `from`, `to` (Boxes), `axis` (`h` or `v`), `head`, `tone` |
| `Line` | A straight line from one point to another | `draw` | `id`, `from`, `to` (Points), `tone` |
| `FanOut` | One place feeding several, a connector to each. Keys from `fanKeys(id, n)`: `<id>.0`, `<id>.1` | `draw` | `id`, `from`, `to`, `axis` |
| `Packet` | One item travelling along a connector's route | `send` | `id`, `from`, `to`, `axis` |
| `Rider` | A label that rides along a path, set `RIDE_ABOVE` (26 px) above it | `ride` | `id`, `d` (the path), `text` |
| `Gate` | Two bars across a line that part when it opens | `open` | `id`, `at` (Point), `size` |
| `HumanMark` | The one orange mark: a person decided here | `mark` | `id`, `at` (Point), `label`, `side` |
| `Annotation` | An outline round a region, a leader line, and a label | `annotate` | `id`, `region` (Box), `label`, `side`, `reach` |
| `Dashed` | A dashed outline, with an optional dashed stub out of its right side | `wipe`, `show` | `id`, `at` (Box), `rx`, `tone`, `stub`, `children` |
| `Tag` | A word in a dashed outline of a fixed size, set inside a line | None of its own | `w`, `h`, `children` |
| `Person` | A head and shoulders, drawn in the ink colour. Never orange | `draw` | `id`, `at` (Box) |
| `Ring` | A hollow ring that can fill solid, with an optional tick | `show`, `fill`, `to` with `x` and `y` | `id`, `at` (Point), `r`, `tick` |
| `PassTick` | The deep-green badge with a white tick: a check passed | `show` | `id`, `at` (Point), `r` |
| `Bracket` | A rule over a span, with a short drop at each end | `draw` | `id`, `x0`, `x1`, `y`, `drop` |
| `Flag` | A pole and a pennant | `draw`, or `show` when `drawn` | `id`, `at` (foot of the pole), `size`, `drawn` |
| `QuoteRule` | The rule down the left of a quotation | `draw` | `id`, `x`, `y0`, `y1` |
| `TickRule` | A rule with ticks along it. Tick keys are `<id>.t0`, `<id>.t1`; `tickXs()` gives where they sit | `draw` the rule, `show` each tick | `id`, `x0`, `x1`, `y`, `ticks`, `tick` |
| `InkRing` | Ink round a region of a screenshot | `draw` | `id`, `at` (Box), `rx` |
| `InkUnderline` | Ink under a line of a screenshot | `draw` | `id`, `x0`, `x1`, `y` |

### Glyphs

| Part | What it draws | Moves it takes | Key props |
|---|---|---|---|
| `Agent` | An AI agent: a ring of three arcs round a body whose shape is its role. Planner a hollow circle, builder a filled circle, tester a square, reviewer a diamond, fixer a triangle | `show`, `rise`, `draw` (the track), `fill` (the ring), `to` with `x` and `y` | `id`, `at` (Point), `role`, `r` (default `AGENT_R`, 22), `label`, `hue`, `ink` |
| `Tile` | A module tile, small (18 px on a 24 px pitch) or large (64 px). `tileBox()` gives its box | `show`, `fill`, `draw` | `id`, `at` (Point), `size`, `hue` |
| `Dept` | A health department: a ring with its name under it | `draw` | `id`, `at` (Point), `r` (36), `label`, `yours`, `hue` |
| `Waveform` | A voice waveform of 24 bars (`WAVE`), each with its own key `<id>.0` to `<id>.23`. Laid out by `waveform()` | `rise`, `fill`, `to` per bar | `layout` |

### Boards, grids and pictures

| Part | What it draws | Moves it takes | Key props |
|---|---|---|---|
| `Board`, `Row`, `Cell` | Rows of work, each a lane of cells and a dot that works the cell in hand. Laid out by `board(spec)`, sizes in `BOARD` (`board-layout.ts`) | `draw` the frame, `work`, `rest`, `pass`, `fail`, `take`, `clear` | `layout`, `holders` (Board); `row`, `holders` (Row); `cell`, `holder` (Cell) |
| `Stations`, `CardToken` | A row of wells a card travels through, a heading over each. Laid out by `stations(spec)`, sizes in `STATIONS` (`stations-layout.ts`); `cardAt(layout, n)` gives the card's x at well n | A well `draw`s on, its heading `rise`s, a lit well `show`s, a left well `wipe`s its quiet fill; the card moves with `to` on `x`, and takes the catalog's edge with `--landed` | `layout`, `catalog`, `landed`, `linkTone` (Stations); `id`, `at`, `landed` (CardToken) |
| `Tab` | A label tab, `TAB_H` (40 px) tall (`tab.tsx`); `tabBeside(ring, side)` places it | `show` | `id`, `at`, `stacked`, `children` |
| `UnitRow` | One small mark per thing counted, lit in order. Laid out by `unitGrid()` | `light` | `layout`, `rx` |
| `TickField` | Hundreds to thousands of marks on one canvas, for a number too large to count by eye | `light` | `id`, `at` (Box), `count`, `cols` |
| `SmallMultiples` | Copies of one picture in a grid, each shown finished. Laid out by `multiples()` | `spread`, `gather` | `layout`, `children` (a function of the copy's index) |
| `ArtefactFrame` | A real screenshot on a white mount. Several stills form a strip that scrolls (`<id>.strip`); the caption is `<id>.source` | `wipe`, `unwipe`; `to` with `y` on `<id>.strip` | `id`, `at` (Box), `stills`, `pinned`, `source`, `sourceAlign`, `edge` (`"catalog"`), `stillH` |
| `TimeRule` | A time rule: a build stretch and a run that draw on, ticks, and marks that light in order. Laid out by `timeRule()` | `draw`, `show`, `light` | `layout` |
| `Ledger` | Lines with a figure that counts beside each label. Keys from `ledgerKeys()` | `rise`; `to` with `count` | `id`, `lines`, `figureRight`, `labelX` |

The kit also exports `route`, `centre` and `place` (geometry helpers), `HUES`, `AGENT_HUES` and `ROLE_HUE` (colour roles, from `palette.ts`), and the camera's `HOME` and `frame()`.

## Verbs

All verbs are in `src/components/deck/kit/verbs.ts`. Each returns moves that carry the house duration and ease and, as importantly, the value the part starts from (`off`), so the engine can work out any step without playing it. Every verb takes `opts`, a `MoveOpts` from `engine/types.ts`:

- `duration` and `ease` override the verb's own.
- `at` is seconds after the click. Left out, a move starts one beat (0.13 s) after the move before it.
- `with: true` starts the move with the one before it.
- `lag` adds seconds to its start without holding back the moves after it.
- `stagger` is the seconds between elements when a key is given as a list, or when several elements share a key.

`Keys` means one key or a list of keys. A list plays in turn.

| Verb | What it animates | Duration and ease |
|---|---|---|
| `step(id, moves, chrome?)` | Makes a `StepDef`. In this talk, use the world helper `picture()` instead | |
| `to(key, on, off?, opts)` | Any properties, from `off` to `on`. The way out when no verb fits; this is how you move `x` and `y` | House default 0.75 s, `expo.out`; a list staggers by `STAGGER.base` |
| `show(key, opts)` | Fades in (`autoAlpha` 0 to 1) | `DUR.quick`, `soft` |
| `hide(key, opts)` | Fades out (`autoAlpha` 1 to 0) | `DUR.quick`, `soft` |
| `rise(key, opts)` | Fades in while rising `RISE` (22 px) into place | `DUR.base`, `expo.out` |
| `lines(key, opts)` | `SetText` lines rise out of their masks (`yPercent` 120 to 0) | `DUR.slow`, `expo.out`, stagger `STAGGER.base` |
| `tell(key, opts)` | A story line comes up (as `lines`) | `DUR.base`, `expo.out` |
| `draw(key, opts)` | Draws a line, frame or outline on (`--d` 0 to 1) | `DUR.draw`, `power2.inOut` |
| `fill(key, { to? })` | Fills a cell or ring (`--k` 0 to 1, or to the amount given) | `DUR.base`, `power2.inOut` |
| `work(row, cell, opts)` | A board row's dot works a cell: the cell fills and the dot rides its front | `DUR.base`, `power2.inOut` |
| `rest(row, opts)` | A board row's dot stands down | `DUR.quick`, `soft` |
| `pass(cells, opts)` | Cells pass: pass tint and a tick (`--pass`) | `DUR.quick`, `soft`, stagger `STAGGER.tight` |
| `fail(cells, opts)` | Cells fail: dashed and a cross (`--fail`) | As `pass` |
| `take(cells, opts)` | An agent takes cells: they tint in the holder's colour (`--hold`) | As `pass` |
| `clear(cells, opts)` | Takes back a verdict and the fill (`--pass`, `--fail`, `--k` to 0) | `DUR.quick`, `soft` |
| `count(key, { to, from? })` | Shows `<key>.box`, then counts the `Counter` up | `DUR.count`, `power3.out` |
| `type(key, opts)` | A `TypeText` types out (`typed` 0 to 1) | `DUR.travel`, linear |
| `mark(key, opts)` | The `HumanMark` appears and draws (`autoAlpha`, `--d`) | `DUR.base`, `power2.inOut` |
| `annotate(key, opts)` | An `Annotation` appears and draws | `DUR.slow`, `power2.inOut` |
| `ghost(key, opts)` | Fades to 0.25 | `DUR.quick`, `soft` |
| `dim(key, opts)` | Fades to 0.45 | `DUR.quick`, `soft` |
| `solid(key, opts)` | Back to full strength | `DUR.quick`, `soft` |
| `send(key, opts)` | A `Packet` travels its route (`along` 0 to 1) | `DUR.travel`, `power2.inOut` |
| `ride(key, opts)` | A `Rider` travels its path and fades in over 0.2 s as it goes | As `send` |
| `open(key, opts)` | A `Gate` opens (`--k`) | `DUR.base`, `page` |
| `light(key, { to })` | A `TickField`, `UnitRow` or `TimeRule` lights its first `to` marks (`lit`) | `DUR.count`, `power3.out` |
| `wipe(key, { from? })` | Opens a part by its clip out of an edge or corner (`--wt`, `--wr`, `--wb`, `--wl`). `from` is `left` (default), `right`, `top`, `bottom` or a corner such as `top-left` | `DUR.base`, `page` |
| `unwipe(key, { toward? })` | Shuts a wiped part back toward an edge or corner | `DUR.base`, `page` |
| `retitle(from, next, opts)` | The old title fades over 0.3 s and the new title's lines come up over 0.9 s, 0.25 s later (`RETITLE`) | As stated |
| `camera(framing, opts)` | Moves the world's camera to a framing (`HOME`, or one from `frame()`) | `DUR.travel`, `page` |
| `spread(hero, layout, opts)` | One picture moves and scales into a grid's first slot (`--x`, `--y`, `--s`) and its copies fade in round it | `DUR.travel`, `page` |
| `gather(hero, layout, opts)` | The grid goes back to the one picture | `DUR.travel`, `page` |
| `chain(beats, { at?, counts? })` | Turns a click's beats into one step's moves. Each beat is `{ moves, hold?, with? }`. A beat starts `hold` seconds (default `HOLD.gap`) after the chain so far has landed; with `with: true` it starts `hold` seconds (default 0) after the previous beat's start | |
| `span(moves, counts?)` | Helper: how long a list of moves takes to land | |
| `covered(from)` | Helper: the clip values of a part shut toward `from` | |
| `behind(front, fractions)` | Helper: the times a drawing line reaches each fraction of its length, to show ticks just behind its front | |

`counts`, in `chain()` and `span()`, tells the timing how many elements share a staggered key (for example a title of three lines), so a beat's end is counted right.

## Tokens

### Motion and size, from `kit/tokens.ts`

| Token | Value | Use |
|---|---|---|
| `STAGE` | `{ w: 1920, h: 1080 }` | The stage, in pixels |
| `EASE.out` | `"expo.out"` | Arrivals |
| `EASE.page` | `"page"` (cubic-bezier 0.2, 0, 0, 1) | Slide changes, things crossing the stage |
| `EASE.carry` | `"carry"` (0.5, 0, 0.15, 1) | A large part carried across as one piece |
| `EASE.soft` | `"soft"` (0.2, 0.65, 0.3, 1) | Small fades and labels |
| `EASE.draw` | `"power2.inOut"` | Lines drawing on, things travelling along them |
| `EASE.count` | `"power3.out"` | Counting up |
| `DUR.quick` | 0.4 s | Fades |
| `DUR.base` | 0.75 s | Most arrivals |
| `DUR.slow` | 1.1 s | Title lines |
| `DUR.draw` | 0.9 s | Drawing a line |
| `DUR.travel` | 1.2 s | Moving along or across |
| `DUR.count` | 1.4 s | Counting |
| `STAGGER.tight` | 0.05 s | Between cells |
| `STAGGER.base` | 0.09 s | Between lines and list items |
| `STAGGER.loose` | 0.16 s | Between larger parts |
| `RISE` | 22 px | How far `rise` travels |
| `HOLD.read` | 1.6 s | Pause after a story line, so it can be read |
| `HOLD.gap` | 0.5 s | Pause between beats in a chain |
| `CHAIN.longest` | 12 s | The longest a click may run |
| `CHAIN.still` | 3 s | The longest the stage may sit still inside a click |
| `box(x, y, w, h)` | | Makes a `Box` |

The custom eases `page`, `soft` and `carry` are registered in `src/components/deck/engine/gsap.ts`. Import `gsap` from there, not from the `gsap` package, so the eases exist. The engine's own defaults, in `engine/compile.ts`, are `BEAT` (0.13 s between moves with no `at`) and `HOUSE` (0.75 s, `expo.out`).

### Colour, from `kit/kit.css`

The names are older than the palette, so read them by role: `--dk-night` is the ground and `--dk-paper` is the colour of words and lines.

| Token | White slides | Navy slides (`[data-ground="navy"]`) | Use |
|---|---|---|---|
| `--dk-night` | `#ffffff` | `#22254e` | The ground |
| `--dk-raised` | `#ececf2` | `#2e3266` | Raised surfaces |
| `--dk-paper` | `#22254e` | `#ffffff` | Words and lines |
| `--dk-soft` | `#6b7086` | `#c5c8d9` | Secondary lines and marks |
| `--dk-rule` | `#dde0ea` | `rgb(255 255 255 / 0.3)` | Rules and tracks |
| `--dk-pass` | `#1f573b` | | The passed tick only |
| `--dk-human` | `#f4642c` | | The human mark and the word "Approved" only |
| `--dk-mount` | `#ffffff` | | The mount behind a screenshot |
| `--dk-ink` | `#22254e` | | Ink drawn on a screenshot |
| `--dk-text` | 32px | | Body text size |
| `--dk-label` | 26px | | Label size |
| `--dk-face` | Geist, then Helvetica Neue, Arial | | The typeface |

The five hues are named only in `kit.css`. Scenes use the role names below, never the hues; `palette.test.ts` fails if a hue name appears in any other file under `src/`.

| Hue | Value | Roles that use it |
|---|---|---|
| `--dk-green` | `#009f4d` | `--dk-process`, `--dk-share-pack` |
| `--dk-indigo` | `#44499c` | `--dk-catalog` (`#8a8fd0` on navy), `--dk-share-code` |
| `--dk-gold` | `#e0a100` | `--dk-lead`, `--dk-dept-c`, `--dk-share-sauce` |
| `--dk-pink` | `#e8559a` | `--dk-fix`, `--dk-dept-b`, `--dk-share-design` |
| `--dk-sky` | `#2f9be3` | `--dk-review`, `--dk-dept-a`, `--dk-share-help` |

Tint strengths: `--dk-tint-idle` 0.12, `--dk-tint-active` 0.55, `--dk-wash` 0.08.

The comment at the top of `kit.css` sets the floor for anything on screen: no text under 32 px, no label under 26 px, rules of 2 px or more, dots of 12 px or more.
