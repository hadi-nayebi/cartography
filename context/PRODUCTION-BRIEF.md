# City story production brief

Use the [storytelling framework](STORYTELLING.md) to build a narrative spine,
calendar or spatial landmarks, and a meaningful viewer payoff.

Start with one useful question about a city or a clearly defined comparison.
Follow the [production model](PRODUCTION-MODEL.md) for record ownership and
learning between releases. Complete this brief before a new
video enters production; use the same evidence standards for every topic.

## Question and viewer payoff

- City, geographic boundary, topic, and time period.
- Geographic form: single city, comparison, state, or country. Name coverage
  and compatible denominators; identify overlapping areas before aggregation.
- Planned duration below ten minutes; justify the time each scene needs.
- One question a viewer should be able to answer after watching.
- Intended viewer and the knowledge the explanation assumes.
- Up to three takeaways, each linked to a reproducible calculation or source.

## Research and data

Record source URLs, publisher, access date, license, definitions, update cadence,
units, geographic resolution, time coverage, exclusions, and uncertainty. Decide
whether the measure is a count, rate, stock, flow, or distribution. Preserve
missing values and measurement breaks; never silently join incompatible series.
A business registration is not necessarily an operating business; reported crime
is not all crime. State the distinction relevant to the selected topic.

Keep each source adapter responsible for its dataset semantics. Reuse mapping,
provenance, and rendering utilities only where their contracts fit. Existing
`pipeline/sources/` adapters, `pipeline/schema.md`, and the `CrimeStory`
composition describe the crime examples; a new topic is not ready merely because
its fields can be renamed to fit that schema.

## Visual sequence

For each scene record the viewer question, data view, finding, duration, and
transition. Include a map with a clear geographic purpose. Choose other views
by the question: a line for change, bars for category comparisons, a histogram
for a distribution. Show denominators where rates are compared. Identify what
new understanding each scene contributes; cut time that only repeats a pattern.

## Annotation plan

For each proposed anchor record:

| Field | Required content |
| --- | --- |
| Date or interval | When the event or measurement change occurred |
| Label | Short on-screen wording |
| Evidence | Source URL, publisher, source date, and supporting passage |
| Relevance | Why it helps answer this video's question |
| Relationship | Context only, or a documented change to the measure |
| Placement | Chart/map location and video time interval |
| Reading budget | Sufficient time and space alongside narration and other labels |

An event close to a turning point does not establish its cause. Spread useful
anchors across the relevant sequence, without crowding the data or requiring
viewers to read several messages at once. Do not invent anchors to fill a quota.

The crime example renderer already supports sourced `contextAnchors`, timed
`annotations`, and map callouts. Check their placement and timing for the new
composition; their existence does not prove a new story's clarity.

## Verification and release

Recompute every displayed figure from the exact release data. Inspect geographic
joins, denominator choices, missing periods, source seams, and annotation
sources. Render and inspect the complete encoded video and audio, including
small-screen legibility, label collisions, transitions, and reading time.
Ask whether a viewer can explain the takeaways without memorizing every number.

Store data provenance, configuration, and render identity with the video. Human
review applies to those exact rendered bytes; edits require a new verification
and approval. Uploading or publishing remains a separate authorized action.
