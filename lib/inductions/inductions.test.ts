import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { expectationsDigest } from "@/scripts/induction-expectations/digest";
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
import {
  expectationsManifestPath,
  expectationsPdfHref,
} from "./expectations-pdf";

const event = getEvent("inductions-2026")!;
const common = () => ({
  name: " Test Student ",
  email: " STUDENT@NITJ.AC.IN ",
  rollNumber: "23103045",
  phone: "+91 98765 43210",
  branch: "Computer Science and Engineering",
  linkedinUrl: "linkedin.com/in/test-student/",
  githubUrl: "https://www.github.com/test-student",
  orcidUrl: "",
  portfolioUrl: "",
  otherClubs: "None",
  whyGdgc: "I want to build things with the community.",
});
const webAnswers = {
  "web-experience": "I have built a few static sites and one full-stack app.",
  "web-areas": ["backend", "frontend"],
  "web-stack": "Next.js, TypeScript, and PostgreSQL",
  "web-project": "A campus library website.",
  "web-project-tech": "Next.js, Drizzle, and Tailwind CSS",
  "web-project-role": "I built search and the borrowing flow.",
  "web-project-links": [
    { url: "github.com/test-student/library", note: "Repository" },
  ],
  "web-why": "To build with people who ship.",
  "web-interest": "Making things people use every day.",
  "web-learning": "Server components and caching.",
  "web-contribute": "The chapter website.",
  "web-resume": [{ url: "drive.google.com/file/d/abc/view", note: "" }],
};
const aiAnswers = {
  "ai-interest": "Campus energy forecasting.",
  "ai-motivation": "To learn and collaborate on real projects.",
};
const input = (
  applications: { departmentId: string; answers: unknown }[] = [
    { departmentId: "web", answers: webAnswers },
  ],
) => ({
  version: inductions2026.version,
  common: common(),
  applications,
  leaveBlank: "",
});

test("the undated induction is first in discovery without fabricated details", () => {
  assert.equal(allEvents[0].id, event.id);
  assert.deepEqual(
    getFeaturedEvents().map((item) => item.id),
    [event.id],
  );
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
      (department) =>
        department.applications === department.questions.length >= 1,
    ),
  );
  assert.deepEqual(
    inductions2026.departments
      .filter((department) => !department.applications)
      .map((department) => department.id),
    ["wit"],
  );
  assert.equal(
    inductions2026.departments.filter((department) => department.expectations)
      .length,
    7,
  );
  assert.deepEqual(
    inductions2026.departments
      .find((department) => department.id === "mobile")
      ?.expectations?.tracks?.map((track) => track.title),
    [
      "Flutter · Dart",
      "React Native · JavaScript",
      "Swift · iOS",
      "Kotlin · Android",
    ],
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
  const details = common();
  assert.equal(commonDetailsSchema.parse(details).email, "student@nitj.ac.in");
  for (const email of [
    "student@gmail.com",
    "student@nitj.ac.in.evil.com",
    "student@fake-nitj.ac.in",
  ])
    assert.equal(
      commonDetailsSchema.safeParse({ ...details, email }).success,
      false,
    );
  for (const change of [
    { whyGdgc: "  " },
    { otherClubs: "  " },
    { phone: "123" },
    { rollNumber: "" },
    { rollNumber: "23/103" },
  ])
    assert.equal(
      commonDetailsSchema.safeParse({ ...details, ...change }).success,
      false,
    );
  assert.equal(
    commonDetailsSchema.safeParse({ ...details, otherClubs: "None" }).success,
    true,
  );
  assert.equal(
    commonDetailsSchema.parse({ ...details, rollNumber: "23bcs045" })
      .rollNumber,
    "23BCS045",
  );
});

test("LinkedIn and GitHub are required canonical profile links; ORCID is optional and checksummed", () => {
  const details = common();
  const parsed = commonDetailsSchema.parse(details);
  assert.equal(parsed.linkedinUrl, "https://www.linkedin.com/in/test-student");
  assert.equal(parsed.githubUrl, "https://github.com/test-student");
  assert.equal(parsed.orcidUrl, "");
  assert.equal(
    commonDetailsSchema.parse({
      ...details,
      linkedinUrl: "https://in.linkedin.com/in/test-student?trk=share",
    }).linkedinUrl,
    "https://www.linkedin.com/in/test-student",
  );
  for (const change of [
    { linkedinUrl: "" },
    { linkedinUrl: "linkedin.com/company/gdgc" },
    { linkedinUrl: "linkedin.com.evil.com/in/test" },
    { githubUrl: "" },
    { githubUrl: "github.com/" },
    { githubUrl: "github.com/test--student" },
    { githubUrl: "github.com/test-student/repo" },
    { githubUrl: "gitlab.com/test-student" },
    { orcidUrl: "0000-0002-1825-0098" },
    { orcidUrl: "orcid.org/1234" },
  ])
    assert.equal(
      commonDetailsSchema.safeParse({ ...details, ...change }).success,
      false,
      JSON.stringify(change),
    );
  for (const orcidUrl of [
    "0000-0002-1825-0097",
    "https://orcid.org/0000-0002-1825-0097/",
  ])
    assert.equal(
      commonDetailsSchema.parse({ ...details, orcidUrl }).orcidUrl,
      "https://orcid.org/0000-0002-1825-0097",
    );
  assert.equal(
    commonDetailsSchema.parse({ ...details, orcidUrl: "0000-0002-9079-593x" })
      .orcidUrl,
    "https://orcid.org/0000-0002-9079-593X",
  );
});

test("one submission carries up to two departments in preference order with separate snapshots", () => {
  const prepared = prepareInductionSubmission(
    event,
    inductions2026,
    input([
      { departmentId: "ai", answers: aiAnswers },
      { departmentId: "web", answers: webAnswers },
    ]),
  );
  assert.ok(prepared.ok);
  assert.equal(prepared.data.email, "student@nitj.ac.in");
  assert.equal(prepared.data.phone, "9876543210");
  assert.equal(prepared.data.name, "Test Student");
  assert.equal(prepared.data.rollNumber, "23103045");
  assert.equal(prepared.data.orcidUrl, null);
  assert.equal(prepared.data.maxDepartments, 2);
  const [ai, web] = prepared.data.applications;
  assert.equal(ai.departmentId, "ai");
  assert.deepEqual(ai.answers, aiAnswers);
  assert.equal(
    web.questionSnapshot.at(-1)?.label,
    inductions2026.departments[0].questions.at(-1)?.label,
  );
  assert.ok(
    web.questionSnapshot.some(
      (question) => question.id === "linkedinUrl" && question.type === "common",
    ),
  );
});

test("more than two, repeated, or unknown departments cannot submit", () => {
  for (const applications of [
    [],
    [
      { departmentId: "web", answers: webAnswers },
      { departmentId: "ai", answers: aiAnswers },
      { departmentId: "creatives", answers: {} },
    ],
    [
      { departmentId: "web", answers: webAnswers },
      { departmentId: "web", answers: webAnswers },
    ],
    [{ departmentId: "unknown", answers: {} }],
    [{ departmentId: "wit", answers: {} }],
  ])
    assert.equal(
      prepareInductionSubmission(event, inductions2026, input(applications)).ok,
      false,
    );
});

test("unexpected questions, missing required answers, and honeypots fail", () => {
  for (const change of [
    { applications: [{ departmentId: "web", answers: {} }] },
    {
      applications: [{ departmentId: "web", answers: { "web-interest": "" } }],
    },
    {
      applications: [
        {
          departmentId: "web",
          answers: { "web-interest": "hello", injected: "question" },
        },
      ],
    },
    { leaveBlank: "bot" },
  ])
    assert.equal(
      prepareInductionSubmission(event, inductions2026, {
        ...input(),
        ...change,
      }).ok,
      false,
    );
});

test("stale versions, drafts, closed windows, and mismatched cycles cannot submit", () => {
  const stale = prepareInductionSubmission(event, inductions2026, {
    ...input(),
    version: 0,
  });
  assert.ok(!stale.ok && stale.code === "stale");
  for (const status of ["completed", "cancelled", "postponed"] as const)
    assert.equal(
      prepareInductionSubmission({ ...event, status }, inductions2026, input())
        .ok,
      false,
    );
  assert.equal(
    prepareInductionSubmission(
      { ...event, visibility: "draft" },
      inductions2026,
      input(),
    ).ok,
    false,
  );
  assert.equal(
    prepareInductionSubmission(
      event,
      { ...inductions2026, eventId: "other" },
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
      input(),
      Date.parse(registration.closesAt),
    ).ok,
    false,
  );
});

// Mirrors the stored row shape the export reads.
function storedRows(prepared: ReturnType<typeof prepareInductionSubmission>) {
  assert.ok(prepared.ok);
  const { applications, maxDepartments: _max, ...common } = prepared.data;
  return applications.map((application, index) => ({
    ...common,
    ...application,
    id: `test-${index}`,
    preference: index + 1,
    createdAt: "2026-11-10T10:00:00Z",
  }));
}

test("CSV preserves multiline responses and original prompts while neutralizing formulas", () => {
  assert.equal(csvCell('a,"b"\nc'), '"a,""b""\nc"');
  for (const value of ["=cmd()", " +1", "-1", "@SUM(1)", "\tformula"])
    assert.ok(csvCell(value).startsWith("\"'"));
  const csv = inductionCsv(
    storedRows(prepareInductionSubmission(event, inductions2026, input())),
  );
  assert.ok(csv.includes(inductions2026.departments[0].questions[0].label));
  assert.ok(csv.includes("A campus library website."));
  assert.ok(csv.includes("https://github.com/test-student"));
  assert.ok(csv.includes('"Preference"'));
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
  const stale = prepareInductionSubmission(event, inductions2026, {
    ...input([
      { departmentId: "ai", answers: { "ai-interest": "Old prompt answer" } },
    ]),
    version: 1,
  });
  assert.ok(!stale.ok && stale.code === "stale");
});

test("ranking snapshots and CSV retain human-readable labels and exact order", () => {
  const prepared = prepareInductionSubmission(
    event,
    inductions2026,
    input([{ departmentId: "creatives", answers: creativeAnswers() }]),
  );
  assert.ok(prepared.ok);
  const [creativeApplication] = prepared.data.applications;
  assert.equal(
    creativeApplication.questionSnapshot.find(
      (question) => question.type === "ranking",
    )?.options?.length,
    5,
  );
  assert.equal(
    creativeApplication.questionSnapshot.some(
      (question) => question.id === "creative-social-content",
    ),
    false,
  );
  const csv = inductionCsv(storedRows(prepared));
  assert.ok(csv.includes("1. Video editing"));
  assert.ok(csv.includes("5. Art and decoration"));
  assert.ok(csv.includes("No"));
});

test("expectation PDFs exist for supplied expectations and match the current content", () => {
  const manifest = JSON.parse(
    readFileSync(
      join("public", expectationsManifestPath(inductions2026.id)),
      "utf8",
    ),
  );
  for (const department of inductions2026.departments) {
    const pdf = join(
      "public",
      expectationsPdfHref(inductions2026.id, department.id),
    );
    if (!department.expectations) {
      assert.equal(department.id in manifest, false);
      continue;
    }
    assert.ok(existsSync(pdf), `${pdf} is missing`);
    assert.equal(
      manifest[department.id],
      expectationsDigest(department),
      `${department.id} expectations changed; run npm run inductions:pdfs`,
    );
  }
});

const mobile = inductions2026.departments.find(
  (department) => department.id === "mobile",
)!;
const mobileAnswers = () => ({
  "mobile-track": "flutter",
  "mobile-machine": "windows",
  "mobile-ram": "16",
  "mobile-level": "built",
  "mobile-project": "Bus Buddy, a campus bus tracker",
  "mobile-project-role": "I built the map screen and the arrival alerts.",
  "mobile-project-links": [
    { url: "github.com/test-student/bus-buddy", note: "Code" },
    { url: "", note: "" },
    { url: "https://youtu.be/demo", note: "Demo video" },
  ],
  "mobile-other-project": "",
  "mobile-explain": "setState tells Flutter to rebuild the widget.",
  "mobile-favorite-app": "",
  "mobile-brownie": "yes",
});

test("App Dev shows project questions for any experienced level and the idea prompt only for beginners", () => {
  const schema = departmentAnswersSchema(mobile);
  const parsed = schema.parse(mobileAnswers());
  assert.deepEqual(parsed["mobile-project-links"], [
    { url: "https://github.com/test-student/bus-buddy", note: "Code" },
    { url: "https://youtu.be/demo", note: "Demo video" },
  ]);
  for (const level of ["practice", "published"])
    assert.equal(
      schema.safeParse({ ...mobileAnswers(), "mobile-level": level }).success,
      true,
    );
  const {
    "mobile-project": _project,
    "mobile-project-role": _role,
    "mobile-project-links": _links,
    "mobile-other-project": _other,
    ...rest
  } = mobileAnswers();
  assert.equal(
    schema.safeParse({ ...rest, "mobile-level": "new" }).success,
    false,
    "beginners must describe an app idea",
  );
  assert.equal(
    schema.safeParse({
      ...rest,
      "mobile-level": "new",
      "mobile-idea": "A mess menu app with ratings.",
    }).success,
    true,
  );
  assert.equal(
    schema.safeParse({ ...mobileAnswers(), "mobile-level": "new" }).success,
    false,
    "project answers are rejected when they do not apply",
  );
  const { "mobile-ram": _ram, ...noLaptop } = mobileAnswers();
  assert.equal(
    schema.safeParse({ ...noLaptop, "mobile-machine": "none" }).success,
    true,
  );
});

test("project links need a web address and a note, and blank rows are ignored", () => {
  const schema = departmentAnswersSchema(mobile);
  for (const links of [
    [],
    [{ url: "", note: "" }],
    [{ url: "github.com/test", note: "" }],
    [{ url: "javascript:alert(1)", note: "Code" }],
    [{ url: "not a link", note: "Code" }],
    Array.from({ length: 6 }, (_, index) => ({
      url: `github.com/test/${index}`,
      note: "Code",
    })),
  ])
    assert.equal(
      schema.safeParse({ ...mobileAnswers(), "mobile-project-links": links })
        .success,
      false,
      JSON.stringify(links),
    );
  const prepared = prepareInductionSubmission(
    event,
    inductions2026,
    input([{ departmentId: "mobile", answers: mobileAnswers() }]),
  );
  assert.ok(prepared.ok);
  const csv = inductionCsv(storedRows(prepared));
  assert.ok(csv.includes("Code: https://github.com/test-student/bus-buddy"));
  assert.ok(csv.includes("Demo video: https://youtu.be/demo"));
});

test("Web multi-select keeps option order, rejects unknown options, and needs at least one", () => {
  const web = inductions2026.departments.find(
    (department) => department.id === "web",
  )!;
  const schema = departmentAnswersSchema(web);
  assert.deepEqual(schema.parse(webAnswers)["web-areas"], [
    "frontend",
    "backend",
  ]);
  for (const areas of [[], ["frontend", "frontend"], ["mobile"]])
    assert.equal(
      schema.safeParse({ ...webAnswers, "web-areas": areas }).success,
      false,
      JSON.stringify(areas),
    );
  assert.equal(
    formatDepartmentAnswer(
      ["frontend", "backend"],
      web.questions.find((question) => question.id === "web-areas")!,
    ),
    "Frontend development, Backend development",
  );
  // The resume link needs no note; project links and the resume are optional.
  assert.deepEqual(schema.parse(webAnswers)["web-resume"], [
    { url: "https://drive.google.com/file/d/abc/view", note: "" },
  ]);
  assert.equal(
    schema.safeParse({
      ...webAnswers,
      "web-project-links": [],
      "web-resume": [],
    }).success,
    true,
  );
});

test("the portfolio link is optional and normalized", () => {
  const details = common();
  assert.equal(commonDetailsSchema.parse(details).portfolioUrl, "");
  assert.equal(
    commonDetailsSchema.parse({ ...details, portfolioUrl: "test.dev" })
      .portfolioUrl,
    "https://test.dev/",
  );
  assert.equal(
    commonDetailsSchema.safeParse({ ...details, portfolioUrl: "not a link" })
      .success,
    false,
  );
  const prepared = prepareInductionSubmission(event, inductions2026, input());
  assert.ok(prepared.ok);
  assert.equal(prepared.data.portfolioUrl, null);
});
