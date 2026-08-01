# Content Review Log

Tracks content-quality passes over `src/data/locations/*` (factual accuracy,
cross-tradition neutrality, narrative voice, virtue fit, timeline
consistency, en/zh structural parity). Run a fresh pass whenever locations
are added or edited significantly; append a new dated section below rather
than overwriting history.

## 2026-08-01 — first full pass (71 entries)

Scope: all entries across `africaAmericasOceania.ts` (16), `eastAsia.ts` (17),
`europe.ts` (14), `middleEastCentralAsia.ts` (9), `southSoutheastAsia.ts` (15).

**Result:** No neutrality, voice, virtue-fit, or en/zh parity issues found.
4 factual/consistency flags — all fixed same day:

1. **`al-qarawiyyin`** — FIXED. Removed the doubtful Gerbert of
   Aurillac/Arabic-numerals legend (mainstream scholarship places his study
   in Catalonia, not Morocco); replaced with well-attested facts (the
   Muqaddimah manuscript, Ibn Rushd and al-Idrisi as alumni).
2. **`cahokia`** — FIXED. "bigger than London of its day" softened to
   "around 1150 its population rivalled that of London at the time,"
   anchored to the timeline's own population-peak year.
3. **`mount-athos`** — FIXED. Replaced the 1054/Great Schism timeline
   entry (thematic, not attested) with the 972 Tragos charter establishing
   Athos's monastic self-governance.
4. **`shwedagon-pagoda`** — FIXED. Legendary founding year corrected from
   -588 to -528, aligning with the app's own Buddha-awakening date used at
   `sarnath`/`mahabodhi`.

`npm run gen:i18n` and `npm run validate-data` both re-run clean after fixes.

Reviewed by: background content-review agent, spawned by Claude Code.
