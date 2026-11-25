# D&D 5e (2014) Character Builder

An offline character builder in plain HTML, CSS and JavaScript. No server, no internet, no images.

## Use it
- **Easiest:** open `dnd-2014-character-builder.html` (a single file) in any browser.
- **Source version:** open `index.html` (it loads `css/` and `js/`).

Characters save automatically in your browser (localStorage). Use **Export file** to back one up as `.json` and **Import file** to load it on another computer or browser. **Print / PDF** prints the sheet.

## Flow
1. Race → 2. Class → 3. Abilities → 4. Background → 5. Equipment → 6. Spells, then **Finish level 1**.
2. **Level Plan** unlocks: add levels 2–20, pick a class for each level (multiclassing is checked), choose subclass, ASIs/feats, fighting styles, invocations, and so on.
3. **Show level** (top bar) shows the sheet, spell counts and warnings at any planned level.
4. The yellow **To check** box lists anything unfinished or against the rules.

## Content
- PHB 2014: 9 races + subraces, 12 classes, 40 subclasses, 361 spells, 42 feats, 13 backgrounds (+ custom), weapons, armor, gear, starting equipment.
- Other official books (2014-era): Goliath (Volo's Guide), Warforged (Eberron: Rising from the Last War), Dhampir (Van Richten's Guide to Ravenloft); Hexblade warlock, Sun Soul monk and Forge Domain cleric (Xanathar's Guide).
- Homebrew: Bearkin (dandwiki) with its subraces; KibblesTasty Spellblade, Psion and Warlord classes with their subclasses; two KibblesTasty subclasses for each PHB class.
- Rules text is summarized, not copied. Homebrew spells that aren't in the PHB appear by name and level only; check the source PDF for their full text.

## Assumptions (homebrew)
- Multiclass requirements for Spellblade (INT 13), Psion (INT 13) and Warlord (WIS or CHA 13) aren't given in the PDFs, so these are assumptions.
- The Psion's own spell list isn't included; Innate Psionics picks from the wizard list.
- The Crusader fighter uses the standard third-caster table (the source table was unclear).

## Rebuild the single file
`python3 build.py` → writes `dist/dnd-2014-character-builder.html`.
