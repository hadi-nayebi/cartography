# OPEVC video workflow

Work on **one video at a time**. Do not start another video's research or
production until Hadi approves the current video. A dataset, completed render,
passing test or agent score does not establish a useful story or approval.

Record the active phase, evidence, unresolved questions and next action in the
owning job. Keep raw conversation and private review notes there; the public
recipe retains sources, reproduction details and curated technical lessons.

## O — Observe and discuss

Discuss with Hadi what makes this video worth watching before production:

- Who is the viewer, and what useful question will the video answer?
- What is the story: opening question, development, meaningful comparison or
  change, and payoff? Why would someone keep watching?
- What should the viewer understand afterward that they did not know before?
- Which evidence could support that story, and what cannot be claimed?
- What was wrong with the previous version, and what visible change is needed?

Use a concise text outline and limited source-feasibility checks. Do not gather
large datasets, build an adapter, design a composition or render a speculative
film to discover whether the topic is wanted. A suggested comparison is an
example until discussed and agreed, not an automatic production instruction.

**Exit gate:** Hadi and the producer have explicitly agreed the topic, central
question, audience, narrative direction and intended payoff. Retain the agreed
outline and the conversation reference. Silence is not agreement. If the premise
is boring, unclear or unsupported, remain in Observe.

## P — Plan the complete execution

Turn the agreed story into a scene-by-scene specification. Resolve details
before spending on production; identify unknowns rather than inventing answers.
Use the [production brief](PRODUCTION-BRIEF.md) and record:

- **Story and timing:** each beat's purpose, new information, exact on-screen
  wording, duration, reading time, transition and connection to the payoff.
- **Evidence:** source/publisher/license, coverage and dates, required fields,
  joins, exclusions, missing values, units, denominators and calculation checks.
  Specify how historical dates are established; survey dates are not openings.
- **Tools and method:** retrieval and transformation commands, renderer, map
  projection, chart type, reusable components, asset/audio sources and licenses,
  output dimensions, dependencies and reproduction steps.
- **Layout:** plot/map and caption regions, coordinates and bounds, font sizes,
  contrast, labels, legends, axes, safe margins, layer order and phone-size view.
- **Annotations:** exact text, source, target year/bar/point/feature, leader
  endpoint, box location, collision avoidance, entrance/hold/exit and reading
  window. Subtitles and annotations are different visual elements.
- **Motion and sound:** reveal sequence, camera target/path, scale behavior,
  transitions, narration/caption relationship, music level and fade boundaries.
- **Packaging and cost:** truthful title/thumbnail promise, chapters, description,
  sources; smallest useful previews, full-render cost/time estimate or stated
  uncertainty, and checks that prevent wasting a full render.
- **Verification:** concrete pass/fail checks for each claim, scene and known
  failure. Name the encoded time windows and small-screen tests to inspect.

**Exit gate:** the plan is executable with no unresolved material story, source
or layout assumptions. Routine technical choices belong to the producer. A
change to the agreed story returns to Observe and discussion with Hadi.

## E — Execute the plan

Gather and freeze the agreed data, preserve provenance, perform transformations,
recompute claims and create the planned maps, charts, annotations, sound and
publishing package. Use the topic's real semantics; do not force it into another
renderer by relabeling fields.

Inspect representative previews and short motion excerpts before the full
render, including crowded and changing layouts. Correct obvious defects here.
Track deviations from the plan. A source failure or new factual constraint
returns to Plan or Observe; it does not authorize an improvised replacement story.

**Exit gate:** a complete candidate artifact and reproducible inputs exist.
This means ready for verification, not accepted or ready to publish.

## V — Verify, review with Hadi, and iterate

Perform separate passes rather than treating one screenshot as verification:

1. **Evidence:** independently recompute displayed claims; check definitions,
   joins, geography, units, periods, source seams and annotation relevance.
2. **Actual video:** inspect the complete encoded candidate and its sound. Check
   full-size and phone-size legibility. Check every annotation's entrance, hold
   and exit: overlap, clipping, position, reading time and exact leader endpoint.
   Check moving cameras, chart scales, labels, transitions, audio levels, pacing,
   and agreement between speech, captions and visuals. Decode and duration
   checks supplement this inspection; they cannot establish visual quality.
3. **Story:** does the opening deliver the title's promise? Does every beat add
   useful understanding? Is the comparison meaningful, the sequence engaging and
   the payoff earned? Compare the revision with the rejected artifact against
   the actual requested improvement.
4. **Human review:** send Hadi the exact candidate with its title/thumbnail and
   description. Obtain his verification and revision requests. Bind acceptance
   to a version/hash; changed pixels, words, data or sound need renewed review.

Visible defects stay with the producer for correction, not with Hadi as basic
QA work. Record checks that could not be performed, including listening; do not
claim a pass or readiness for release when a required check is missing.

**Return routes:** wrong/boring premise → Observe; flawed sequence, evidence
approach or layout → Plan; implementation/render defect → Execute. Every repair
returns through Verify, including a recurrence check and regression inspection.

**Exit gate:** Hadi approves the exact artifact. No automatic acceptance from
technical checks, elapsed time, a partial excerpt or prior-version approval.
Publication remains a separately authorized action.

## C — Condense and change the workflow

After each review iteration, including a rejection, record the failure, its
cause, the actual correction, the reusable mechanism changed, its location and
how the next iteration will prove the defect has not recurred. Apply the change
before returning to the needed phase. At final acceptance, retain the accepted
recipe, artifact identity and lessons the next video must consume.

A note alone is not improvement. For example, replacing “check annotation
spacing” with a required exact-target/entrance/hold/exit inspection is a workflow
change; the next encoded inspection must demonstrate that it works. Likewise,
a mandatory agreed-story gate prevents another dataset-only film. Mark a lesson
unverified until its consuming iteration supplies evidence.

**Exit gate:** the lesson is implemented and its next check is assigned. Begin
another video only after current-video approval and this condensation. Review
wait does not authorize parallel production under the current operating rule.
