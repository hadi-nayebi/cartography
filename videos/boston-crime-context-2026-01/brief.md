# Boston: the long arc and the local pattern

**Current phase: Plan/Execute. Boston story confirmed; full revision requested.**

The agreed story is how recorded crime evolved over decades in Boston and how
patterns differ across its neighborhoods. Continue the same story and submit the
full revised video for review. Apply the [OPEVC workflow](../../context/OPEVC-WORKFLOW.md).
Boston remains the only active video until exact-artifact approval. Police district
counts must be labeled as districts, not represented as neighborhood boundaries;
citywide historical series do not establish historical neighborhood trends.

## Established outline for revision

Viewer question: How did Boston’s recorded crime change, and where did recent reports accumulate?

The original annual-histogram and animated-map structure is the visual baseline.
The film is 330 seconds, with retained music and no narration. Preserve its useful
information density while giving meaningful annotations 6–8 seconds and separate
reading space. A technical check cannot establish creative acceptance.

| Time | Story | Annotation role |
| --- | --- | --- |
| 0–8 s | Boston’s 71% fall in FBI index crimes,1989–2015 | Hook with exact period and measure |
| 8–22 s | Orient the viewer to years, districts and reported locations | Explain the views briefly |
| 22–150 s | Annual histogram reveals 1985–2025 progressively |1989 property share; 1993 decline already underway; 1996 Ceasefire; 2000 property decline; 2003 Big Dig; 2010 violent-offense decline; 2015 endpoint; 2020 emergency; 2023 rebound |
| 150–163 s | Shift from the citywide annual view to districts/months | Plain city-focused transition |
| 163–292 s | Animated district map, monthly chart and running category/district counts |2022 annual low;D 4 change;August 2024 monthly peak;2025 property share;2016–2025 decline |
| 292–318 s | Full-window district distribution | Counts, not a personal safety score |
| 318–330 s | Source and recipe route | Document the evidence |

History notes are verified against history/trend files; district and monthly
notes are recomputed from timeline cells with service records excluded.
Operation Ceasefire’s youth-firearm target is sourced to DOJ, and the March 2020
emergency to Boston’s order (README links). Neither event is assigned the whole
crime trend’s causal effect. The 2016 measurement change is explained as a
factual change in BPD’s records, without instructions to the producer.

Before delivery compare actual encoded samples to the original cut: retain the
histogram progression, mapped activity and separate monthly chart. Verify label
spacing and annotation reading time. Inspect the complete encoded artifact;
archive rejected versions separately and bind review to exact bytes.

Calendar context follows [the storytelling framework](../../context/STORYTELLING.md). Ceasefire, the Big Dig and the local COVID emergency serve Boston’s particular story. Generic technology milestones were dropped because they added little city-specific understanding. `story-beats.json` records exact non-overlapping cue windows and sources.

## Revision 3 execution and verification details

Retain the frozen July 2026 source snapshot, 330-second timeline, 1920×1080 at
30fps, original music and caption-led presentation. The builder recomputes the
named annual, category and district findings before rendering. No new historical
neighborhood series is implied: long-run values are citywide; local maps cover
July 2021–June 2026 police districts.

The annual plot occupies x300–1620, with baseline y800 and a 400px height. Each
annotation card is 490×100px at y286, horizontally clamped inside that plot width;
its 25px heading and 20px detail sit below a 16px year/type label. Its leader
terminates at the named bar's actual revealed top, with a contrasting ring. The
readout is above the card; axes/era legends are below the plot. One card is active
at a time. Card fade-in is 15 frames and fade-out is 18 frames. Exact windows and
copy are retained in story-beats.json and config.json.

The source-boundary label and its line previously entered the card region.
FullTrend now suppresses that redundant label while a callout is visible and
starts the boundary line at the plot top. The separate measurement explanation
and era legend remain. Inspect 2015/2020/2023 card entrances and exits to verify
this correction in the encoded output, not merely the source preview.

The map chapter retains its separate lower annotation band, timeline and side
columns. Inspect each of its six timed notes at entrance, hold and exit, as well
as moving map labels and the corrected monthly axis. Check full-size and 640px
landscape views; inspect the entire timeline for pacing and transitions. Record
actual inspection coverage and unavailable listening explicitly. No prior QA
or approval transfers to the new bytes.

## Revision4: a pause behind the chart

The1996 Ceasefire annotation opens a30-second silent illustrated interlude. The
chart freezes at58.5s, flips away, and resumes the exact same frame afterward.
Four shots show the narrower youth-firearm focus, a coordinated meeting,
enforcement and service referrals, and the distinction from citywide crime.
Original vector illustrations are labeled conceptual; no archival claim,
incident location, victim count or causal effect is invented. Source and timing
are locked in `interlude-sources.json`.

Cultural orientation stays on-chart: the Web's public announcement in1991 and
the first YouTube upload in2005. These are temporal context. The surrounding
cards have disjoint reading windows. The full film becomes360seconds; later
data frames are shifted30seconds, not accelerated or skipped. Existing music
is time-stretched without pitch change. No narration.

Verification: inspect both flip edges and four scene holds, compare frozen and
resumed chart frames, inspect all new/shifted annotations at1920px and640px,
and decode the full360s delivery. Human editorial/listening review remains open.
