# Boston: four decades, two measuring systems

A three-minute, caption-led story about Boston's recorded crime from 1985 to
2025, with a district map and historical context. The source snapshot was
retrieved July 12, 2026. It is not a live crime feed.

## What the data supports

- The retained FBI UCR series falls from 70,003 in 1989 to 20,110 in 2015:
  71% when rounded.
- The newer series counts crime-classified records assigned to a BPD district.
  It falls from 46,849 in 2016 to 29,963 in 2025, or 36%; 2025 is 9% above
  the 2022 low of 27,537.
- The 2025 district records reconcile to 29,963. D4 has the largest count in
  that view, 5,584. Counts do not measure population-adjusted risk or rank safety.

The two annual series use different definitions. They appear in separate
panels at the source boundary. The modern grouping is this repository's
documented classification of offense descriptions, not a claim of official
NIBRS classification. Service records are excluded. Records are not unique
victims; omitted public sexual-assault records do not imply zero such crimes.
District names are familiar reference names, not exact neighborhood borders.

## Sources and context anchors

- [Dataset provenance](../../data/boston-ma/PROVENANCE.md), including BPD
  resources, keyword rules, exclusions and district geography.
- [Analyze Boston incident source](https://data.boston.gov/dataset/crime-incident-reports-august-2015-to-date-source-new-system).
- [US DOJ Operation Ceasefire account](https://ojjdp.ojp.gov/sites/ojjdp/files/pubs/gun_violence/profile02.html): the citywide strategy began in May 1996 and targeted youth firearm violence.
- [NIJ evaluation](https://nij.ojp.gov/library/publications/problem-oriented-policing-deterrence-and-youth-violence-evaluation-bostons): its target and evaluation concern youth violence; the broader total shown here cannot assign the city's decline to one intervention.
- [Boston emergency extension order](https://www.boston.gov/sites/default/files/file/2020/04/PHE%20Declaration%20Extension.pdf) identifies the original public-health emergency as March 15, 2020. The marker supplies historical context, not an estimated causal effect.

## Reproduce

Use Node 22 and the pinned dependencies in `surface/remotion/package-lock.json`.
From the repository root:

```sh
node pipeline/validate.mjs boston-ma
node pipeline/episodes/build-boston-review.mjs
cd surface/remotion
npm ci
npx remotion render src/index.ts BostonReview ../../videos/boston-crime-context-2026-01/out/review-v1.mp4 --codec=h264 --concurrency=4
```

The builder reads the committed normalized snapshot, checks caption-critical
figures, records input checksums in `story-data.json`, and stages the story in
Remotion's public folder. An updated source must pass those checks or the copy
must be reviewed. Geometry comes from the same source district boundaries.

`music.mp3` contains the first three minutes of the existing Boston Stable Audio
Open score, encoded at 160 kbps and retained here for reproduction. The builder
stages that exact file; the composition lowers its level and applies fades.
See [audio generation documentation](../../pipeline/audio/README.md) for the
original source/tooling and license. No narration is present in this caption-led
version.

`render.lock.json` identifies the rendered bytes; `qa.json` records what was
actually checked. Human acceptance and publication remain separate from a
successful build. No YouTube URL is claimed until an upload receipt exists.
