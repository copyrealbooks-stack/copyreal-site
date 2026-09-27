# Cover upload audit — 27 September 2026

Source: Copy Real Books Drive / All Book Covers: https://drive.google.com/drive/folders/1dzX1Enq5_maE3s3ruUvNZTDJpT9cA45Y

Status: folder metadata rechecked after final user upload. These are *source files*, not finished newly branded exports. Do not infer that an audiobook has been completed just because cover art exists. Existing originals must be preserved. User confirms **Mondaloy** is the canonical title; website and old assets currently spell it `Mondaloy`. Do not conflate the title and filename migrations: preserve old asset filenames until replacement paths are updated and tested.

## Identifiable audio or edition artwork

| Work | Source filenames | Intake decision |
|---|---|---|
| Apocalypse Park | `Apocalypse_Park_CFX_3000x3000.jpg` | CFX reference only; audio production is planned, do not sell yet. |
| The Lion, the Witch and the Wardrobe | `The Lion, the Witch and the Wardrobe(4).png` | Inspect visually and determine PN/CFX; separate edition slots already exist in dev store. |
| Prince Caspian | `Prince Caspian PN Cover.jpg`, `.png`; `Prince Caspian CFX Cover.jpg`, `.png` | Both edition artwork pairs present. Check branding/rights and whether images differ before selecting masters. |
| The Coming Race | `the coming race pn cover.jpg` | PN source available. |
| Murder at the Vicarage | `Murder at the Vicarage.jpg` | Newly uploaded; visually identify edition before assignment. |
| What Is Happening Now? | `WIHN audiobook cover.jpg` | Confirm 2026 vs 2027 and audio edition before attaching. |
| Isan Bedtime Stories | `Isan audio cover.png` | Audio artwork source; verify version/language. |
| Crimea | `Crimea audiobook cover.png`, `crimea ebook cover.jpg` | Audiobook and matching eBook source artwork. |

## eBook / project references only unless audio completion independently verified

- Trion: Ascension: `trion bbok 2 front.jpg`, `trion bbok 2 front.png` — audiobook in progress.
- Trion: A New Genesis: `Trion A New Genesis (ebook cover HD).jpg`.
- The Last Exodus: `The Last Exodus Ebook.png` — added in final batch.
- Glitch: `Glitch ebook cover.jpg`.
- Free Party: `fp cover 26.jpeg`.
- Two generically named `Ebook cover.jpg` and `ebook cover.jpg` files — title unidentified.

## Files whose title or edition is not established by filename

- `file_000000001ed471f4b0b34a61ebcb124a.png`
- `file_00000000d01081f4ae796470ea7a5b44.png`
- `ChatGPT Image Sep 26, 2026, 08_48_23 AM.jpg`
- `Ebook cover.jpg`
- `ebook cover.jpg`
- `file_000000009adc71f49ae0dfecf11b7793.png`
- `file_000000008f047246b768df7704242619.png`
- `file_000000006774720c84d562517a7aef5c.png` (new final batch)
- `file_00000000f9b071f4a35b6808b8175b6a.png` (new final batch)
- `file_0000000043a0720aba2bc929345ef770.png` (new final batch)

Do not map unnamed files to The Martian Shadow or any other title without visual inspection. Check known Ash & Iron project assets separately.

## Related website references

- Existing eBook art: `assets/covers/`, `assets/covers/catalogue/`.
- Existing audiobook thumbnails: `assets/covers/audio/`.
- The audiobook and books pages currently use `Mondaloy`. **Canonical work title: Mondaloy.** Keep legacy `monaloy` URLs as redirects or aliases when changing routes, and update metadata, search, heading, artwork titles and SKU display names together. Never break existing retailer links without checking.
- Ash and Iron is a series comprising War of the Worlds, The Martian Shadow and The Manufactured Sky. The series's War of the Worlds is distinct from H. G. Wells's classic.

## Production and launch gates

1. Prefer existing approved final PN/CFX art. Use AV-era covers only as references; new retail art must say Copy Real Audio or Copy Real CFX, with no old branding.
2. For missing art, preserve illustrations and create 3000 × 3000 square exports with exact title, author, narrator and clear edition badges.
3. Confirm which **audiobook editions are actually completed** from publishing records before creating a missing-edition list. The presence of an eBook or CFX reference does not establish audio readiness.
4. Match and inspect images before placing them in the store; keep original Drive files untouched and export separately named working copies.
5. Do not publish previews from old compressed source samples; confirm remastered files.
6. Leave sales disabled and R2 private until territories, audio files, sample links, Stripe checkout and secure downloads pass end-to-end testing.
