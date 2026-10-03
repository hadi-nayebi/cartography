# City story production brief

Follow [OPEVC phase gates](OPEVC-WORKFLOW.md). One active video; no production
before story agreement and no next video before current-video approval.

## Story agreement and current phase

Record the agreed question, audience, narrative direction and payoff, plus the
private owner record holding Hadi's agreement. State pending explicitly when
there is no agreement. Identify the current phase and unresolved questions.

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
| Placement | Exact target bar/point/feature; leader endpoint; box bounds; caption and label clearance |
| Motion | Entrance, hold and exit intervals; collision checks across movement |
| Reading budget | Sufficient time and space alongside narration and other labels |

An event close to a turning point does not establish its cause. Spread useful
anchors across the relevant sequence, without crowding the data or requiring
viewers to read several messages at once. Do not invent anchors to fill a quota.

The crime example renderer already supports sourced `contextAnchors`, timed
`annotations`, and map callouts. Check their placement and timing for the new
composition; their existence does not prove a new story's clarity.

## Execution specification

For each scene complete this table before execution; unresolved material fields
keep the video in Plan.

| Detail | Specification |
| --- | --- |
| Story | Question, takeaway, exact copy, source and reading time |
| Data | Fields, transformations, joins, exclusions, units and calculation check |
| Visual | Tool/component, projection/scale, plot bounds, axes and legend |
| Placement | Coordinates, font sizes, safe areas, layering and phone-size check |
| Motion | Reveal/camera path, timing, transition, annotation target tracking |
| Audio | Narration/captions, music source, levels, fades and listening check |
| Preview | Smallest meaningful still/motion check before a full render |
| Cost | Expected render work and uncertainty; stop conditions |
| Acceptance | Exact encoded windows, defect checks and story payoff to verify |

## Verification and release

Recompute every displayed figure from the exact release data. Inspect geographic
joins, denominator choices, missing periods, source seams, and annotation
sources. Render and inspect the complete encoded video and audio, including
small-screen legibility, label collisions, transitions, and reading time.
Ask whether a viewer can explain the takeaways without memorizing every number.

Store data provenance, configuration, and render identity with the video. Human
review applies to those exact rendered bytes; edits require a new verification
and approval. Uploading or publishing remains a separate authorized action.

## Title, thumbnail and description package

Select a title/thumbnail pairing with a clear reason; produce alternatives only
when they answer a concrete editorial or experiment question. Include the complete description with chapters, source/recipe links
and credits. Inspect thumbnails at small display size. Make the first seconds
of the film fulfill the title’s promise. A dramatic number must retain its
measure and period; do not imply danger from raw report counts.

Preserve selected asset hashes and exact metadata with the video’s review record.
After release use actual clicks, watch time and retention to test assumptions;
record experiment eligibility and method before claiming a winning variant.

## Iteration and condensation

| Observed failure | Return to O/P/E | Actual correction | Reusable workflow change and file | Next consuming check | Evidence/result |
| --- | --- | --- | --- | --- | --- |

Do not mark a lesson proven because this table was filled. Verify its effect in
the next actual iteration. Hadi's final verification binds the exact artifact.
