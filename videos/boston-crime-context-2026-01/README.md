# Boston · Forty Years of Change

A five-and-a-half-minute story: an annual histogram reveals Boston’s long arc,
then an animated district map and monthly chart explore the recent pattern.
Timed annotations connect the data to useful historical context and local findings.
The source snapshot was retrieved July 12, 2026; the annual chart ends in 2025
and the map covers July 2021 through June 2026.

## What the data supports

- The retained FBI UCR series falls from 70,003 in 1989 to 20,110 in 2015:
  71% when rounded.
- The newer series counts crime-classified records assigned to a BPD district.
  It falls from 46,849 in 2016 to 29,963 in 2025, or 36%; 2025 is 9% above
  the 2022 low of 27,537.
- The 2025 district records reconcile to 29,963. D 4 has the largest count in
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
npx remotion render src/index.ts CrimeStory ../../videos/boston-crime-context-2026-01/out/review-v3.mp4 --props=../../videos/boston-crime-context-2026-01/config.json --codec=h264 --concurrency=4
```

The builder reads the committed normalized snapshot, checks caption-critical
figures, records input checksums in `story-data.json`, and stages the story in
Remotion's public folder. An updated source must pass those checks or the copy
must be reviewed. Geometry comes from the same source district boundaries.

`music-v2.mp3` contains five and a half minutes of the existing Boston Stable Audio
Open score, encoded at 160 kbps and retained here for reproduction. The builder
stages that exact file; the composition lowers its level and applies fades.
See [audio generation documentation](../../pipeline/audio/README.md) for the
original source/tooling and license. No narration is present in this caption-led
version.

`render.lock.json` identifies the rendered bytes; `qa.json` records what was
actually checked. Human acceptance and publication remain separate from a
successful build. No YouTube URL is claimed until an upload receipt exists.

## Boston context

Operation Ceasefire (1996), the Big Dig’s downtown tunnel openings (2003), and
Boston’s COVID emergency (2020) place the city’s history beside the crime data.
Each serves this particular story; none is assigned the whole trend’s cause.
`story-beats.json` records exact reading windows, sources and selection reasons.
The 1993 finding shows that the decline preceded Operation Ceasefire.

- [MassDOT: the Big Dig tunnels and bridges](https://www.mass.gov/info-details/the-big-dig-tunnels-and-bridges).

## Review v2 encoded repair

The first full revision2 encode used source90f454b. Encoded QA found the redundant
`/mo` label overlapping the monthly axis’s top tick. The source component now
omits that label because the chart title already states the units. The delivery
copy applies a small opaque label patch over that area and redraws the verified
3000 top tick, only during the map chapter. No data curve or other label is changed.
The original full encode is retained separately; review locks record both hashes.

Reproduce that delivery-stage patch from the original full encode:

```sh
ffmpeg -i review-v2.mp4 -vf "drawbox=x=472:y=845:w=52:h=30:color=0x07090c:t=fill:enable='between(t,163,291.9667)',drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf:text='3000':x=479:y=854:fontsize=17:fontcolor=0x71857a:enable='between(t,163,291.9667)'" -c:v libx264 -preset fast -crf 18 -c:a copy -movflags +faststart review-v2-fixed.mp4
```

A fresh render from the corrected component does not need this patch. It produces
a new artifact requiring its own hash and review.


## Review v3

The same story now uses short cards connected to their exact annual bars. The
measurement-boundary label yields while those cards are visible. Encoded review
also caught a clipped monthly readout and basemap labels behind chart axes;
the readout now stays inside the plot, and a separate panel protects the chart.
The closing total is explicitly labeled as the source archive.

The delivered 330-second candidate combines unchanged frames 0–4889 from source
8f8e45a with rerendered frames 4890–9899 from f332cab. The original continuous
audio is preserved. `render.lock.json` records each segment and the final hash;
a complete render from f332cab reproduces the corrected visual design. A final
H.264 encode uses CRF20, maxrate1000k and bufsize2000k, followed by faststart remux.

Verification covers a full decode, exact duration/frame count, timeline samples
and every annotation entrance/hold/exit, with full-size critical checks and
640px landscape sheets. These are sampled checks, not frame-by-frame human
playback. Human editorial acceptance and listening remain pending.

Reusable checks from this iteration: inspect the measurement boundary with an
active historical card, inspect the final monthly readout near the right edge,
and inspect chart axes over the actual basemap. These checks found defects in
the full encode that an earlier isolated annotation preview did not reveal.
