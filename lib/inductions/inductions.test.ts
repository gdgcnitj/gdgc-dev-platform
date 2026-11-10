import assert from "node:assert/strict";
import { test } from "node:test";
import { departmentIds } from "@/lib/content/departments";
import { allEvents, getEvent, getFeaturedEvents } from "@/lib/content/events";
import { inductions2026 } from "@/lib/content/inductions/2026";
import { eventSchema } from "@/lib/events/schema";
import {
  compareEventListing,
  eventDate,
  isCampusRegistration,
} from "@/lib/events/helpers";
import {
  commonDetailsSchema,
  inductionCycleSchema,
  departmentAnswersSchema,
  visibleAnswers,
  formatDepartmentAnswer,
} from "./schema";
import { prepareInductionSubmission } from "./submission";
import { csvCell, inductionCsv } from "./csv";

const event = getEvent("inductions-2026")!;
const input = () => ({
  version: inductions2026.version,
  common: {
    name: " Test Student ",
    email: " STUDENT@NITJ.AC.IN ",
    phone: "+91 98765 43210",
    branch: "Computer Science and Engineering",
    otherClubs: "None",
    whyGdgc: "I want to build things with the community.",
  },
  answers: { "web-interest": "A campus library website." },
  leaveBlank: "",
});

test("the undated induction is first in discovery without fabricated details", () => {
  assert.equal(allEvents[0].id, event.id);
  assert.equal(getFeaturedEvents()[0].id, event.id);
  assert.equal(eventDate(event), undefined);
  assert.equal(event.location?.name, undefined);
  assert.ok(compareEventListing(event, getEvent("minimol")!) < 0);
  assert.equal(isCampusRegistration(event), false);
});

test("every department has configured questions; only supplied expectations are shown", () => {
  assert.deepEqual(
    inductions2026.departments.map((department) => department.id).sort(),
    [...departmentIds].sort(),
  );
  assert.ok(
    inductions2026.departments.every(
      (department) => department.questions.length >= 1,
    ),
  );
  assert.equal(
    inductions2026.departments.filter((department) => department.expectations)
      .length,
    6,
  );
  assert.equal(
    inductions2026.departments.find((department) => department.id === "mobile")
      ?.expectations?.tracks?.length,
    3,
  );
  const invalid = structuredClone(inductions2026);
  invalid.departments.push(invalid.departments[0]);
  assert.equal(inductionCycleSchema.safeParse(invalid).success, false);
});

test("application sections and presets cannot attach to unrelated event forms", () => {
  assert.equal(
    eventSchema.safeParse({ ...event, registration: { mode: "none" } }).success,
    false,
  );
  assert.equal(
    eventSchema.safeParse({ ...event, sections: [] }).success,
    false,
  );
  assert.equal(
    eventSchema.safeParse({
      ...event,
      registration: {
        mode: "internal",
        form: "campus",
        state: "open",
        cycleId: "inductions-2026",
      },
    }).success,
    false,
  );
});

test("common answers normalize institute email and reject lookalike domains", () => {
  const common = input().common;
  assert.equal(commonDetailsSchema.parse(common).email, "student@nitj.ac.in");
  for (const email of [
    "student@gmail.com",
    "student@nitj.ac.in.evil.com",
    "student@fake-nitj.ac.in",
  ])
    assert.equal(
      commonDetailsSchema.safeParse({ ...common, email }).success,
      false,
    );
  assert.equal(
    commonDetailsSchema.safeParse({ ...common, whyGdgc: "  " }).success,
    false,
  );
  assert.equal(
    commonDetailsSchema.safeParse({ ...common, otherClubs: "  " }).success,
    false,
  );
  assert.equal(
    commonDetailsSchema.safeParse({ ...common, otherClubs: "None" }).success,
    true,
  );
  assert.equal(
    commonDetailsSchema.safeParse({ ...common, phone: "123" }).success,
    false,
  );
});

test("server submissions preserve normalized common and department-specific snapshots", () => {
  const web = prepareInductionSubmission(event, inductions2026, "web", input());
  assert.ok(web.ok);
  assert.equal(web.data.email, "student@nitj.ac.in");
  assert.equal(web.data.phone, "9876543210");
  assert.equal(web.data.name, "Test Student");
  assert.equal(
    web.data.questionSnapshot.at(-1)?.label,
    inductions2026.departments[0].questions[0].label,
  );
  const aiInput = {
    ...input(),
    answers: {
      "ai-interest": "Campus energy forecasting.",
      "ai-motivation": "To learn and collaborate on real projects.",
    },
  };
  const ai = prepareInductionSubmission(event, inductions2026, "ai", aiInput);
  assert.ok(ai.ok);
  assert.equal(ai.data.email, web.data.email);
  assert.deepEqual(ai.data.answers, aiInput.answers);
  aiInput.common.name = "Changed for the second department";
  assert.equal(web.data.name, "Test Student");
});

test("unknown departments, unexpected questions, missing required answers, and honeypots fail", () => {
  assert.equal(
    prepareInductionSubmission(event, inductions2026, "unknown", input()).ok,
    false,
  );
  for (const change of [
    { answers: {} },
    { answers: { "web-interest": "" } },
    { answers: { "web-interest": "hello", injected: "question" } },
    { leaveBlank: "bot" },
  ])
    assert.equal(
      prepareInductionSubmission(event, inductions2026, "web", {
        ...input(),
        ...change,
      }).ok,
      false,
    );
});

test("stale versions, drafts, closed windows, and mismatched cycles cannot submit", () => {
  const stale = prepareInductionSubmission(event, inductions2026, "web", {
    ...input(),
    version: 0,
  });
  assert.ok(!stale.ok && stale.code === "stale");
  for (const status of ["completed", "cancelled", "postponed"] as const)
    assert.equal(
      prepareInductionSubmission(
        { ...event, status },
        inductions2026,
        "web",
        input(),
      ).ok,
      false,
    );
  assert.equal(
    prepareInductionSubmission(
      { ...event, visibility: "draft" },
      inductions2026,
      "web",
      input(),
    ).ok,
    false,
  );
  assert.equal(
    prepareInductionSubmission(
      event,
      { ...inductions2026, eventId: "other" },
      "web",
      input(),
    ).ok,
    false,
  );
  const registration = {
    mode: "internal" as const,
    form: "department-interest" as const,
    cycleId: inductions2026.id,
    state: "open" as const,
    closesAt: "2026-11-11T00:00:00Z",
  };
  assert.equal(
    prepareInductionSubmission(
      { ...event, registration },
      inductions2026,
      "web",
      input(),
      Date.parse(registration.closesAt),
    ).ok,
    false,
  );
});

test("CSV preserves multiline responses and original prompts while neutralizing formulas", () => {
  assert.equal(csvCell('a,"b"\nc'), '"a,""b""\nc"');
  for (const value of ["=cmd()", " +1", "-1", "@SUM(1)", "\tformula"])
    assert.ok(csvCell(value).startsWith("\"'"));
  const prepared = prepareInductionSubmission(
    event,
    inductions2026,
    "web",
    input(),
  );
  assert.ok(prepared.ok);
  const csv = inductionCsv([
    { ...prepared.data, id: "test", createdAt: "2026-11-10T10:00:00Z" },
  ]);
  assert.ok(csv.includes(inductions2026.departments[0].questions[0].label));
  assert.ok(csv.includes("A campus library website."));
});

const creatives = inductions2026.departments.find(
  (department) => department.id === "creatives",
)!;
const rankingQuestion = creatives.questions.find(
  (question) => question.type === "ranking",
)!;
const creativeAnswers = () => ({
  "creative-preferences": rankingQuestion.options.map((option) => option.id),
  "creative-tools": "Figma and DaVinci Resolve",
  "creative-work": "I designed the posters for a campus event.",
  "creative-social-presence": "no",
});

test("Creatives rankings require every known field exactly once and preserve preference order", () => {
  const schema = departmentAnswersSchema(creatives);
  const answers = creativeAnswers();
  const reversed = [...answers["creative-preferences"]].reverse();
  const parsed = schema.parse({ ...answers, "creative-preferences": reversed });
  assert.deepEqual(parsed["creative-preferences"], reversed);
  assert.ok(
    formatDepartmentAnswer(
      parsed["creative-preferences"],
      rankingQuestion,
    ).startsWith("1. Art and decoration"),
  );
  for (const ranking of [
    reversed.slice(1),
    [...reversed, reversed[0]],
    reversed.map(() => reversed[0]),
    reversed.map((id, index) => (index ? id : "unknown")),
  ])
    assert.equal(
      schema.safeParse({ ...answers, "creative-preferences": ranking }).success,
      false,
    );
});

test("Creatives social follow-up is required only for Yes and hidden answers are never submitted", () => {
  const schema = departmentAnswersSchema(creatives);
  const answers = creativeAnswers();
  assert.equal(schema.safeParse(answers).success, true);
  assert.equal(
    schema.safeParse({ ...answers, "creative-social-presence": "yes" }).success,
    false,
  );
  assert.equal(
    schema.safeParse({
      ...answers,
      "creative-social-presence": "yes",
      "creative-social-content":
        "https://example.com/creative — I post illustration reels.",
    }).success,
    true,
  );
  const hidden = {
    ...answers,
    "creative-social-content": "This old draft must stay private.",
  };
  assert.equal(
    "creative-social-content" in visibleAnswers(creatives, hidden),
    false,
  );
  assert.equal(schema.safeParse(hidden).success, false);
  assert.equal(
    schema.safeParse({ ...answers, "creative-social-presence": "maybe" })
      .success,
    false,
  );
});

test("provided AI and Creatives prompts replace samples; CP contains both years and selection criteria", () => {
  const ai = inductions2026.departments.find(
    (department) => department.id === "ai",
  )!;
  assert.equal(ai.questions.length, 2);
  assert.equal(creatives.questions.length, 5);
  assert.ok(
    [...ai.questions, ...creatives.questions].every(
      (question) => !question.sample,
    ),
  );
  const cp = inductions2026.departments.find(
    (department) => department.id === "cp",
  )!;
  assert.deepEqual(
    cp.expectations?.groups.map((group) => group.title),
    ["First-year students", "Second-year students", "Selection criteria"],
  );
  assert.equal(cp.expectations?.groups[0].sections?.length, 4);
  assert.equal(cp.expectations?.groups[1].sections?.length, 3);
  assert.match(JSON.stringify(cp.expectations), /Dynamic programming/i);
});

test("new question definitions reject duplicate options and invalid conditional references", () => {
  const cycle = structuredClone(inductions2026);
  const department = cycle.departments.find((item) => item.id === "creatives")!;
  const choice = department.questions.find((item) => item.type === "choice")!;
  choice.options.push(choice.options[0]);
  assert.equal(inductionCycleSchema.safeParse(cycle).success, false);
  choice.options.pop();
  department.questions.at(-1)!.when = { questionId: "missing", equals: "yes" };
  assert.equal(inductionCycleSchema.safeParse(cycle).success, false);
});

test("stale AI tabs receive a version error even when the current form has new required fields", () => {
  const stale = prepareInductionSubmission(event, inductions2026, "ai", {
    ...input(),
    version: 1,
    answers: { "ai-interest": "Old prompt answer" },
  });
  assert.ok(!stale.ok && stale.code === "stale");
});

test("ranking snapshots and CSV retain human-readable labels and exact order", () => {
  const prepared = prepareInductionSubmission(
    event,
    inductions2026,
    "creatives",
    { ...input(), answers: creativeAnswers() },
  );
  assert.ok(prepared.ok);
  assert.equal(
    prepared.data.questionSnapshot.find(
      (question) => question.type === "ranking",
    )?.options?.length,
    5,
  );
  assert.equal(
    prepared.data.questionSnapshot.some(
      (question) => question.id === "creative-social-content",
    ),
    false,
  );
  const csv = inductionCsv([
    {
      ...prepared.data,
      id: "creative-test",
      createdAt: "2026-11-10T10:00:00Z",
    },
  ]);
  assert.ok(csv.includes("1. Video editing"));
  assert.ok(csv.includes("5. Art and decoration"));
  assert.ok(csv.includes("No"));
});
