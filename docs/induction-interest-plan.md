# Induction interest forms

Accepted design for the next induction cycle, updated with the supplied AI and
Creatives questions, CP syllabus, and required other-clubs answer. Implementation and editing instructions
are in [the induction content guide](induction-content.md). The working branch is
`feat/induction-interest`, created from the latest `origin/develop`.

## Confirmed scope

- List an induction event prominently on the homepage and at the top of `/events`.
- Use the shared event layout and carousel. Date, time, and venue are unconfirmed.
- Students may submit interest forms for multiple departments, separately.
- Require an `@nitj.ac.in` email, with no account or sign-in step.
- Share the common questions across every department form.
- Use supplied AI and Creatives questions; retain editable samples for other departments.
- Show the supplied expectations for the six technical departments.
- Keep expectations optional for departments whose content has not been supplied.

## Student experience

The event page at `/events/inductions-2026` has this order:

1. **Inductions 2026**: a short invitation and primary **Explore departments**
   action. State that this is an expression of interest, followed by shortlisting
   and an offline round. Show date, time, and venue as **To be announced**.
2. **Carousel**: the common event carousel with approved induction artwork or
   relevant chapter photos. Do not represent past photos as induction photos.
3. **Choose your department**: eight consistent cards, using the existing
   department identity, icon, color, and short description. Each card has a clear
   **Open interest form** action and a secondary **View expectations** disclosure.
4. **What happens next**: submit interest, shortlisting, offline round/interview,
   then team announcement. No invented deadlines or interview arrangements.
5. **Questions**: applying to several departments, confirmation, and arrangements
   being announced later. Do not invent selection criteria or eligibility rules.

Use the existing department IDs: `web`, `ai`, `ui`, `cp`, `mobile`, `wit`,
`devsecops`, and `creatives`. Induction-facing labels can say AI/ML, UI/UX, and
App Development without renaming IDs or changing historical content.

### Expectations

On a department card, use a native accessible disclosure with a small topic
preview. Expanding it reveals grouped lists with normal body text. Avoid a long
wall of text, an extra modal, or a separate expectation page. Keep the form action
outside the disclosure so it is always easy to find.

Repeat the same disclosure near the heading of the department's form. Direct
links therefore include the context. Opening it does not clear form answers.
App Development has shared basics and three distinct track groups; make it clear
that these are alternative tracks rather than presenting one combined checklist.
Do not require an "I know everything listed" checkbox.

Women in Tech and Creatives have forms, but their expectation content is unset.
Show a short "Expectations will be shared soon" note until that copy is supplied;
do not fabricate requirements for either department.

### Filling and submitting

Routes:

| Route                                        | Purpose                                            |
| -------------------------------------------- | -------------------------------------------------- |
| `/events/inductions-2026`                    | Public event, expectations, and department choices |
| `/events/inductions-2026/apply`              | Department choices within the application flow     |
| `/events/inductions-2026/apply/<department>` | Direct link to one department form                 |

The actual route files live under `app/events/[id]/apply/`, with a dynamic
`[department]` child. Only events with the induction form configuration support
these pages; other events and unknown departments return 404.

1. On the first form, complete **About you** with the common questions.
2. Complete the chosen department's question and review the information.
3. Submit explicitly to that department. Show **Your interest has been submitted
   to Web Development**, for example, rather than implying selection.
4. **Apply to another department** opens the choices within `/apply`. Reuse the
   common details and show an **Edit details** action. Only that department's
   question needs answering before its own review and submission.

A client provider in the application layout retains the shared details and
per-department drafts while students move within this flow. Display progress
only for submissions confirmed by the server. A failed request preserves answers.
Successful submission clears that department's draft, not the shared details.
Form transitions focus the new heading; validation focuses the first invalid
field. Support keyboard use, phone widths, and reduced motion.

In this initial scope, drafts last for the current application flow. Do not claim
they survive refresh, leaving the flow, or switching devices. Do not put contact
details or answers in URLs or persistent browser storage.

## Common questions

Define these once and render the same schema in every department form.

| Field                         | Input                             | Validation and copy                                                 |
| ----------------------------- | --------------------------------- | ------------------------------------------------------------------- |
| Name                          | Text, name autocomplete           | Required; trimmed full name                                         |
| Email                         | Email, email autocomplete         | Required; normalized lowercase `@nitj.ac.in` address                |
| Phone                         | Telephone, telephone autocomplete | Required; reuse Indian mobile validation and normalization          |
| Branch                        | Select                            | Required; reuse the existing branch options, including Other        |
| Other clubs you are part of   | Short textarea                    | Required; helper: "Write None if you are not part of another club." |
| Why do you want to join GDGC? | Textarea                          | Required; a concise explanation, with a sensible maximum length     |

Do not add roll number, year, course, resume, or portfolio as compulsory fields.
Those belong in a later, explicitly requested change. The current campus event
registration schema requires several of them, so do not reuse it unchanged.

## Editable sample department questions

The original sample prompts below are retained here as design history. AI and
Creatives now use the supplied questions in the content file. Other departments
still use editable samples. Keep their
IDs stable when only copy changes. Each initially uses one required textarea.
Replace or explicitly approve the sample questions before opening the real form.

| Department              | Question ID          | Sample question                                                                      |
| ----------------------- | -------------------- | ------------------------------------------------------------------------------------ |
| Web Development         | `web-interest`       | What is one website you would like to build, and who would use it?                   |
| AI/ML                   | `ai-interest`        | What is one everyday problem you would like to explore using AI?                     |
| UI/UX                   | `ui-interest`        | Pick an app you use. What is one screen you would improve, and why?                  |
| Competitive Programming | `cp-interest`        | How do you approach a programming problem you have not seen before?                  |
| App Development         | `mobile-interest`    | What is one mobile app you would like to build, and why?                             |
| Women in Tech           | `wit-interest`       | What is one activity you would suggest to help more women participate in technology? |
| DevSecOps               | `devsecops-interest` | What would you like to learn about deploying or securing an application?             |
| Creatives               | `creatives-interest` | What is one creative idea you would use to introduce GDGC to new students?           |

## Supplied expectation content

Use the supplied material as topic guidance, without adding proficiency levels,
mandatory projects, or thresholds. Repeated slide branding, the quotation, and
closing slides do not need to become page sections. Replace the slide's "Google
form" reference with "interest form" because submissions live in this app.

| Department              | Groups and topics                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Competitive Programming | **Foundations:** compilers, runtime environments, online judges, time and space complexity, basic math and number theory, inference and induction proofs. **Data structures:** arrays, strings, linked lists, stacks, queues, hashing. **Techniques and practice:** sorting, searching, two pointers, sliding window, prefix and suffix techniques, recursion, backtracking, problem-solving patterns, basic contest practice.                                                                                                                                                                                                                                                                                                                                                            |
| UI/UX                   | **People and process:** introduction to UI/UX, user-centered design, user needs and personas, design thinking, user research. **Structure and visuals:** information architecture, wireframing, low-fidelity prototypes, visual hierarchy, layout, color, typography, iconography, imagery. **Interaction and evaluation:** accessibility, inclusive design, interaction basics, usability testing, feedback loops, responsive design, micro-interactions, motion, iteration. **Tools and communication:** Figma fundamentals, component systems, design systems and consistency, FigJam/Miro collaboration, portfolio presentation, case studies.                                                                                                                                        |
| AI/ML                   | **Python and maths:** lists, dictionaries, functions, NumPy, Pandas, Scikit-learn, problem solving, linear algebra, basic calculus. **Probability and statistics:** expectation values, distributions, hypothesis testing, correlation versus causation. **Data:** missing values, outliers, data types, categorical encoding, charts, choosing plots, EDA, interpretation, feature engineering. **Models and evaluation:** linear/logistic regression, decision trees, random forests, ensembles, SVM, K-means, perceptrons, forward/backpropagation, activation functions, gradient descent, bias/variance, train/test/validation splits.                                                                                                                                               |
| Web Development         | **Web fundamentals:** full-stack, frontend, backend, REST APIs, HTTP methods/status codes, routing, middleware. **Applications:** databases, authentication, authorization, CRUD, WebSockets, real-time communication, API testing. **Delivery and collaboration:** deployment, Git/GitHub, version control, branching, merging, pull requests, conflicts, environment variables, error handling, debugging.                                                                                                                                                                                                                                                                                                                                                                              |
| App Development         | **Shared basics:** OOP, classes/objects/inheritance, simple problem solving such as reversing a string, summing a list and factorial logic, MVVM/MVC. **Swift/iOS track:** Swift syntax, variables, optionals, functions, struct/class, `@State`/`@Binding`, SwiftUI VStack/HStack/ZStack/Text/Button/Image, basic state/counter, navigation/NavigationStack. **Flutter/Dart track:** variables, functions, lists, maps, Stateless/Stateful Widgets, null safety, Column/Row/Container/Text/Image/Scaffold, `setState`, rebuilds, MaterialApp → Scaffold → Body. **Kotlin/Android track:** Android Studio, syntax, val/var, functions, null safety (`?`, `!!`), activities, MainActivity/XML layouts, `findViewById`, `setOnClickListener`, intents/navigation, TextView/Button/EditText. |
| DevSecOps               | **Linux:** commands, filesystem, permissions, packages, shell scripting, processes, environment variables, logs. **Networking:** OSI/TCP-IP, IP addressing, DNS, DHCP, HTTP, ports, protocols, firewalls, NAT, network tools, VPNs, proxies. **Collaboration:** version control, Git setup, branches, merging/conflicts, `.gitignore`, GitHub/GitLab, pull requests, code review.                                                                                                                                                                                                                                                                                                                                                                                                         |

## Content and code structure

Keep three responsibilities distinct:

- **Event content** in `lib/content/events/inductions-2026.ts`: title, description,
  carousel, announcement state, featuring, next steps, and application availability.
- **Induction content** in `lib/content/inductions/2026.ts`: stable cycle ID,
  form version, participating department IDs, expectations, questions, and order.
- **Form behavior** in `lib/inductions/` and `components/inductions/`: shared
  validation, input primitives, common-details state, review, and submission.

Reuse the department registry as the source of identity. If its current placement
in `home.ts` couples validation to UI imports, extract a small serializable
department catalog and have the homepage enrich it with leads and icons. Do not
maintain a second competing list of department IDs.

Extend internal registration with a validated **department-interest** preset
referencing the cycle ID. Keep its availability state/window on the event, using
the existing server-side availability rules. An ordered **applications** section
renders the department grid at the intended point in the page. Validate the
event-to-cycle link and do not repeat the cycle configuration in sections.
The hero action becomes **Explore departments**, rather than a generic Register
button. The existing campus action must explicitly reject this new preset.

The question renderer supports text, textarea, choice, and ranking inputs, plus
conditions referencing earlier choices. Give questions stable IDs,
labels, helper text, required flags, and length bounds. Store expectations as
groups of items, with optional track groups. Do not build an arbitrary form builder or admin editor.

For discovery, feature the induction event in the homepage spotlight and order
active featured events before completed featured recaps. In the archive, order
scheduled/live events above completed events, including events without dates.
Use shared ordering helpers and test the undated case. Do not invent a date to
push the induction event to the top or restore the removed status filter/pills.

## Submission and storage

Use a new `induction_submission` table, rather than overloading
`event_registration.interests` or the unrelated `app_dev_response` table.

| Data                     | Storage                                                                     |
| ------------------------ | --------------------------------------------------------------------------- |
| Identity                 | UUID, stable event/cycle ID, department ID, creation timestamp              |
| Common answers           | Name, normalized email/phone, branch, other clubs, why GDGC                 |
| Department answers       | Validated JSONB keyed by stable question ID                                 |
| Definition at submission | Form version and a server-built snapshot of question IDs, labels, and types |
| Duplicate constraint     | Unique event/cycle + department + normalized email                          |

One successful submit writes one complete row in one operation. Copy the common
answers into that department's row. This deliberate snapshot keeps each submission
independent: changing details for a later application does not silently rewrite
an earlier submission. A shared mutable profile is unnecessary for this public,
no-sign-in flow.

The server resolves the published event, configured cycle, open window, and known
department on every submission. It validates common answers and exactly the
configured question IDs, rejects unexpected answers, and checks the submitted form
version against the current one. Build the question snapshot on the server; never
trust labels sent by a browser. A changed form asks the student to review the new
question instead of silently dropping an answer.

Use the existing honeypot and client-hash attempt pattern, with bounds appropriate
for eight legitimate department submissions from shared campus connections.
Uniqueness must be enforced by PostgreSQL so double clicks and concurrent requests
cannot create duplicate applications. Handle duplicates with a useful confirmation,
without returning someone else's answers or allowing an overwrite.

An institute email suffix validates the address format; it does not prove ownership.
With the agreed no-sign-in flow, do not offer public lookup, editing, or access to
stored submissions by entering an email. Add verified ownership separately if
cross-device access or editing is requested later. Never log raw form answers.

## Reviewing responses

The existing dashboard is only a placeholder; it has no staff roles or department
permissions. The uncommitted local registration-sheet tool reads the old event
table and must not be silently changed or treated as an induction review system.

For the initial implementation, provide a documented server-side, read-only export
command with cycle/department filters, run by an authorized operator using existing
database access. Export each department's common answers and its questions, escape
CSV correctly, and neutralize spreadsheet formula prefixes. Do not commit exports
or expose them through public URLs. A browser review dashboard with reviewer roles,
shortlisting state, or messaging is a separate scope.

## Implementation order and acceptance

1. Extract/reuse department identity; add induction configuration and validation.
2. Add the event, application preset/section, expectations UI, and discovery order.
3. Build the common-details → department question → review → submit flow.
4. Add the submission migration, server action, duplicate handling, and export.
5. Verify desktop/phone layouts and keyboard/focus behavior. Test two department
   submissions reuse common details while retaining different answers; invalid
   email/department/question, stale version, closed windows, duplicates/concurrency,
   failed requests, and isolation from existing registration flows.
6. Run `npm run check`, induction/event tests, migrations against a fresh database,
   and `npm run build`. Update architecture/content docs and CI for the new tests.

Keep the event as a draft until the page copy/artwork and sample questions are
reviewed. Opening interest collection does not require an offline date, time, or
venue. Set application availability explicitly; an unknown deadline stays absent.
Publishing or releasing this feature follows the normal PR workflow after execution
is requested. The implementation enables local preview of the complete flow; production forms
open only after the feature is reviewed and released.
