# Content Gap Notes — Future Location Additions

Coverage snapshot taken 2026-08-01 (65 locations at the time). Re-run the
counts below after any batch of new locations to see what's still thin.

```
# by continent
grep -o "continent: '[a-z-]*'" src/data/locations/*.ts | sed "s/.*continent: '//;s/'//" | sort | uniq -c

# by tradition
grep -o "traditions: \[[^]]*\]" src/data/locations/*.ts | grep -o "'[a-z-]*'" | sort | uniq -c | sort -rn
```

## Gaps found (2026-08-01)

**Geographic** — Asia (38) and Europe (13) dominate; Africa (6), North
America (3), South America (3), and Oceania (2) are thin.

**Tradition** — Buddhism (20), scholarship (14), indigenous (11),
Christianity (11), Islam (9) are well covered. Judaism, Sikhism, and
Zoroastrianism each have exactly **1** location. **Jainism has zero.**

## Candidate locations, roughly ranked by how much they'd close a gap

1. **Jainism (currently zero coverage)** — Shatrunjaya or Ranakpur. Adding
   either fully closes a missing-tradition gap, not just a thin one.
2. **Judaism beyond the single existing site** — Safed (birthplace of
   Kabbalah) or the Talmudic academies of Babylon/Sura.
3. **Sikhism beyond the Golden Temple** — Anandpur Sahib, tied to the
   founding of the Khalsa.
4. **South America** — Coricancha (Cusco) as an indigenous
   wisdom/astronomy site, or another location tied to Andean cosmology
   (distinct from the usual Machu Picchu framing).
5. **Sub-Saharan Africa, non-Islamic** — existing African entries
   (Timbuktu, al-Qarawiyyin, al-Azhar) are all Islamic-scholarship
   tradition. Consider Ifá divination heritage (Nigeria/Benin) or an
   Ethiopian Orthodox site beyond Lalibela.
6. **North America indigenous beyond Cahokia** — Chaco Canyon, or an
   Iroquois Confederacy / Great Law of Peace site (strong fit for a
   governance/wisdom angle).
7. **Oceania beyond Uluru** — a Māori or Pacific Islander site tied to
   wayfinding/navigation wisdom (Polynesian celestial navigation).

## Process reminder

Per [content-review.md](content-review.md): any new location added from
this list needs a content-quality pass (factual accuracy, neutral
cross-tradition tone, story-like voice, virtue fit, timeline consistency,
en/zh parity) logged there before shipping — same as the first full pass.
