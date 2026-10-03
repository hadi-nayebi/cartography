# Reproducible city stories

A video answers a geographic question in less than ten minutes. Its public
record lets another producer inspect the evidence and reproduce the result.
Each production also improves the research, checks or presentation used next time.

## The production unit

Use a distinct story identifier for each topic, geography and edition, such as
`nyc-libraries-schools-2026-01`. Existing city-named crime records remain valid;
do not move or overwrite an earlier release to create a second story in that city.
These identifiers are a record convention, not a claim that the current
city-oriented dashboard or CrimeStory renderer supports every topic.

The existing `videos/<story-id>/` layout should retain:

- `README.md`: viewer question, findings, limitations, source links and exact
  reproduction commands, including prerequisite tools and versions.
- `brief.md`: the completed [production brief](PRODUCTION-BRIEF.md), scene plan,
  annotation evidence and viewer payoff.
- `config.json`: composition inputs and references to topic-appropriate data.
- `youtube.json`: title, complete description, chapters, credits, visibility and eventual platform ID.
- `packaging/`: three title/thumbnail candidates, recommended pairing, rationale and selected asset hashes.
- `render.lock.json`: actual output path, SHA-256, duration, render command,
  source revision and data snapshot identity.
- `qa.json`: calculation/visual/audio review evidence and the render hash it
  covers. A source/config review is not a review of the encoded video.

Adapters belong in `pipeline/sources/`; reusable snapshots and their provenance
belong under `data/`. A recipe names every input path, upstream URL, access date,
license, raw checksum, transformation command, exclusion and output checksum.
If a source cannot be redistributed, publish its retrieval recipe and explain
the restriction. Keep tokens, internal strategy and raw human feedback private.

For a new topic, agree the adapter and composition contracts before rendering.
Do not rename arbitrary measures to satisfy the existing crime schema.

## One cycle, two outputs

| Phase | Story work | Reusable result |
| --- | --- | --- |
| Observe | Research the question, audience and available evidence | Record source semantics and failure cases |
| Plan | Select geographic scope, scenes and sourced annotations | Choose an existing recipe or identify its specific gap |
| Execute | Fetch, normalize, calculate, design and render | Improve a shared adapter or component only where useful |
| Verify | Recompute claims and inspect final encoded pixels/audio | Add a check for a real defect and verify its repair |
| Condense | Preserve the release recipe and human judgment | Retain the lesson, identify its consumer, and check it on the next story |

A lesson is useful when it changes later work. Record the observed problem,
the correction, the retained file/check and the next production that will use it.
Do not infer improvement from more steps, elapsed time or a self-assigned score.
Human ratings should name the dimension, reason and visible revision needed.

## Geographic forms

- **One city:** keep its boundary and reporting period explicit.
- **Several cities:** align definitions, periods and denominators before using
  shared scales. Separate incompatible series rather than ranking them together.
- **A state or country:** state whether the data covers the whole geography or
  selected places. Do not add overlapping areas or average rates without their
  appropriate denominators.

Facility points can show where recorded facilities are. They do not by
themselves measure service capacity, accessibility, quality or unmet need.
An annual dataset release is not necessarily a historical event series.
Churches, schools and libraries need consistent definitions and coverage before
their counts can be compared. Missing coverage is not zero.

## Weekly planning and release

Maintain a short candidate queue with the viewer question, geographic form,
sources, source-readiness status, visual approach, useful context anchors and
estimated production effort. Distinguish **candidate**, **source checked**,
**selected**, **in production**, **reviewed** and **released**. Do not turn a
weekly plan into a claim that seven videos are ready.

Start with a representative pilot. Measure research effort, render time,
revision effort and quality before committing to daily or multiple daily
releases. Independent research can overlap; heavy rendering follows the
machine's resource limits. A quota ceiling is not a posting schedule.

Before upload, verify the locked channel identity and the exact render bytes.
The upload CLI ignores stored visibility: it uses private visibility unless
the operator explicitly supplies `--public`. That flag remains a separate
publication action, not an editorial-quality certificate. Use the studio's
human review gate; the CLI hash check does not replace review of data, narration,
annotation truth or changed configuration.

After release, record the actual video ID and visibility, link the public
recipe from the video description, and update the project page with the verified
video and methodology link. Keep internal production plans off the viewer page.
Record viewer feedback as evidence with its limitations; update the next recipe
when it reveals a reproducible weakness.
