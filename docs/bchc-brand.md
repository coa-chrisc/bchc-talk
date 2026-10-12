# BCHC deck: Austin Public Health branding

Written 2026-10-11 from the owner's own deck, `Austin_BCHC_DMWG_Presentation 1.pptx` (29 slides, Geist, white with navy dividers). The owner's note: the talk is an Austin Public Health presentation, so it must not carry the website's space theme. This replaces the palette in `bchc-colour-direction.md`. The role rules there (what each colour means per Part, strokes vs fills, colour arrives by work) still hold; only the hues and the background change.

## What the owner's deck does

- White slides. Title and section-divider slides on navy, with a big faded section number.
- Austin Public Health logo top-left on every content slide. Logo colours: indigo `#44499C` and green `#009F4D`. Files: `public/talks/bchc/brand/aph-logo.v1.png` (colour, 1920×646, transparent) and `aph-logo-white.v1.png` (for navy slides).
- A small-caps eyebrow label above the title (e.g. "THE ARCHITECTURE"), in indigo or green.
- A short green rule under the title. This is the deck's motif; keep it.
- Rounded cards with a thin grey outline, icons in small circles, dark navy bands for the "reusable layer".
- Footer: "Austin Public Health · BCHC Data Modernization Work Group", slide number bottom-right.
- Geist for everything. Titles bold, around 36–44 pt on a 10-inch slide. Body regular.
- BCHC is set as text in the deck (no logo file). Keep it as text.

## Palette for the talk

| Token | Hex | On white | Role |
|---|---|---|---|
| paper | #FFFFFF | | background |
| raised | #ECECF2 | | the only second surface (cards, wells) |
| navy | #22254E | 14.3:1 | all words; title and close slide background |
| slate | #6B7086 | 5.2:1 | secondary labels |
| rule | #DDE0EA | | lines |
| green | #009F4D | 3.5:1 | **the process, agents at work** (Austin's green) |
| indigo | #44499C | 8.0:1 | **the catalog, what's shared** (logo indigo) |
| deep green | #1F573B | 8.9:1 | **reserved:** a check passed (ticks only) |
| orange | #F4642C | 3.1:1 | **reserved:** a person approves (from the bulb icon) |
| gold | #E0A100 | 2.2:1 | set per Part (bulb yellow) |
| pink | #E8559A | 3.6:1 | set per Part (bulb pink) |
| sky | #2F9BE3 | 3.3:1 | set per Part |

Mapping from the old night palette, so the role aliases in `kit.css` keep their names:

| Old | New |
|---|---|
| night → | paper #FFFFFF (background flips to light) |
| paper (words) → | navy #22254E |
| soft → | slate |
| mint (process) → | green #009F4D |
| sky (catalog) → | indigo #44499C |
| green (pass) → | deep green #1F573B |
| coral (human) → | orange #F4642C |
| butter → | gold |
| rose → | pink |
| lilac → | sky #2F9BE3 |

Navy slides (1, 43, 44 and any section opener): words in white, the process in green, the catalog in a lighter indigo `#8A8FD0`, rule at white 0.3.

## Rules that change with a light background

1. **Words are navy.** The one exception stays: "Approved" in orange.
2. **Strokes at full strength, fills at fractions.** Large fills 0.12 idle, 0.55 active (lower than on night, because tints on white go pastel fast). Washes 0.06–0.10.
3. **Gold is for fills and strokes 3 px or wider, never thin lines or words.** It sits at 2.2:1 on white.
4. **Green means the process and a tick means a pass.** Both are green; the tick is the darker one and only ever a tick. Nothing else is deep green.
5. **No stars, no gradients, no glows.** The backdrop is plain white (navy on the title and close).
6. **Stills are shown in colour**, on a white mount with a thin rule, and a 3 px indigo edge where the mount shows the catalog. Capture the catalog's default card grid, not the list view, so people recognise the site.
7. **Projector check:** every accent except gold stays above 3:1 on white; words stay above 7:1.
