# How the use case catalog was built

Written 2026-10-09 from the owner's own account (the owner is Christopher Collins, Austin Public Health). This is the true story behind Part 1 of the BCHC talk, especially slides 8–10. Read it, along with `docs/bchc-two-things-we-share.md`, before changing any Part 1 copy or animation.

## The ask

- The Big Cities Health Coalition asked Austin Public Health and the City of Austin to help them build a use case catalog, one place where every department could share its work.
- We considered many ideas.

## The idea: GitHub as the content system

- The idea was to turn GitHub into a content management system.
- It came from an earlier Austin Public Health project with the same constraints: no money for servers or hosting, no wish to pay an outside agency a lot of money, but GitHub accounts we already had.
- On that earlier project we wrote Ruby and Jekyll code on top of features GitHub already provides. The result was a website with no server and an automated submission form.
  - A form submission opens a GitHub issue.
  - Scripts turn the issue into a pull request, so the submission becomes site content on its own.
  - A person reviews and approves the pull request, and the site updates.
- Austin Public Health partnered with BCHC to build the catalog the same way.

## What made it possible: the agentic development process

**Session 1, the first draft in one day**
- Christopher sat down with his fleet of agents and the development process.
- He gave them the idea, pointed them at the earlier GitHub project to base it on, and they looked at modules we had already built.
- The agents took apart the earlier project, laid out the options and talked through with him how it could work and what made sense. This was a real back-and-forth planning phase.
- The agents mapped out a plan, and he approved it.
- Then, using the skills, the memory layer, the context engine and the rest of the structure around the agents, they planned the build and assembled almost all of it on their own in that one session.
- He had the planning conversation early in the day, the agents worked most of the day, and by the afternoon there was a first draft.

**Feedback round 1**
- He shared the draft with BCHC. They thought it was amazing and asked for changes.
- Together we brainstormed, with people in the loop, about what worked, what didn't and how to make it better.

**Session 2**
- Another development session updated and improved it until it was solid.

**Feedback round 2**
- We showed it to the work group's participants and BCHC leaders. Everyone gave it a thumbs up, with some more feedback on changes and branding.

**Session 3**
- The agents made those changes and fine-tuned the submission process.

## In short

Three working sessions and three rounds of feedback. The agents did the heavy lifting, with dozens of them working on the project, and people made the decisions. That's how the catalog was built.

## Facts to keep straight on slides

- "Three working sessions." Never "72 hours", and don't give the length of a session in hours.
- BCHC asked. Austin Public Health partnered and built it. BCHC and the work group gave feedback after each session.
- The approach (GitHub as the content system with Ruby/Jekyll scripts) was reused from an earlier Austin Public Health project.
- The process is what made it possible. The catalog is one product of that process (see `docs/bchc-two-things-we-share.md`).
- Slide 9 shows three session blocks, each followed by a feedback mark from BCHC or the work group. It has no clock, no hours and no timeline.
