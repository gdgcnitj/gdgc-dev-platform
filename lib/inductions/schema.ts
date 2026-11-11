import { z } from "zod";
import { departmentIds } from "@/lib/content/departments";
import { registrationSchema } from "@/lib/content/registration";

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const copy = z.string().trim().min(1);
const expectationSection = z.object({
  title: copy,
  items: z.array(copy).min(1),
});
const expectationGroup = expectationSection.extend({
  sections: z.array(expectationSection).min(1).optional(),
});
// A description turns a choice into a tile with a second line.
const option = z.object({ id, label: copy, description: copy.optional() });
const questionBase = z.object({
  id,
  label: copy,
  hint: copy.optional(),
  required: z.boolean().default(true),
  sample: z.boolean().default(false),
  // Shows the question when an earlier choice is the option, or any of the options.
  when: z
    .object({ questionId: id, equals: z.union([copy, z.array(copy).min(1)]) })
    .optional(),
});
const textLength = z.number().int().min(1).max(5000);
const questionSchema = z.discriminatedUnion("type", [
  questionBase.extend({
    type: z.literal("textarea"),
    maxLength: textLength.default(2000),
  }),
  questionBase.extend({
    type: z.literal("text"),
    maxLength: textLength.default(500),
  }),
  questionBase.extend({
    type: z.literal("choice"),
    options: z.array(option).min(2).max(12),
  }),
  questionBase.extend({
    type: z.literal("ranking"),
    options: z.array(option).min(2).max(12),
  }),
  // Any number of options; answers keep the options' order.
  questionBase.extend({
    type: z.literal("multi"),
    options: z.array(option).min(2).max(12),
  }),
  // Links with a short note each, such as a repository, store listing, or demo video.
  questionBase.extend({
    type: z.literal("links"),
    maxLinks: z.number().int().min(1).max(10).default(5),
    // False for a single obvious link, such as a resume, that needs no note.
    notes: z.boolean().default(true),
  }),
]);

export const inductionCycleSchema = z
  .object({
    id,
    eventId: id,
    version: z.number().int().positive(),
    // Counted per normalized email and roll number across every submission.
    maxDepartments: z
      .number()
      .int()
      .min(1)
      .max(departmentIds.length)
      .default(2),
    departments: z
      .array(
        z.object({
          id: z.enum(departmentIds),
          preview: copy,
          expectations: z
            .object({
              intro: copy.optional(),
              groups: z.array(expectationGroup).min(1),
              tracks: z.array(expectationGroup).min(1).optional(),
              tracksIntro: copy.optional(),
              // A closing line after every group and track.
              outro: copy.optional(),
            })
            .optional(),
          // The department lead's welcome, shown above that department's questions.
          note: z.array(copy).min(1).optional(),
          // False for departments members belong to without applying, such as Women in Tech.
          applications: z.boolean().default(true),
          // Shown on the event card when the department takes no applications.
          membership: copy.optional(),
          questions: z.array(questionSchema).max(12).default([]),
        }),
      )
      .min(1)
      .max(departmentIds.length),
  })
  .superRefine((cycle, ctx) => {
    if (
      new Set(cycle.departments.map((department) => department.id)).size !==
      cycle.departments.length
    )
      ctx.addIssue({
        code: "custom",
        path: ["departments"],
        message: "Department IDs must be unique",
      });
    for (const [index, department] of cycle.departments.entries()) {
      if (department.applications !== !!department.questions.length)
        ctx.addIssue({
          code: "custom",
          path: ["departments", index, "questions"],
          message:
            "Departments taking applications need questions; others have none",
        });
      if (!department.applications && !department.membership)
        ctx.addIssue({
          code: "custom",
          path: ["departments", index, "membership"],
          message:
            "Explain how to join a department that takes no applications",
        });
      if (
        new Set(department.questions.map((question) => question.id)).size !==
        department.questions.length
      )
        ctx.addIssue({
          code: "custom",
          path: ["departments", index, "questions"],
          message: "Question IDs must be unique",
        });
      for (const [questionIndex, question] of department.questions.entries()) {
        if (
          "options" in question &&
          new Set(question.options.map((item) => item.id)).size !==
            question.options.length
        )
          ctx.addIssue({
            code: "custom",
            path: ["departments", index, "questions", questionIndex],
            message: "Option IDs must be unique",
          });
        if (question.when) {
          const controller = department.questions
            .slice(0, questionIndex)
            .find((item) => item.id === question.when!.questionId);
          const expected = [question.when.equals].flat();
          if (
            !controller ||
            controller.type !== "choice" ||
            !expected.every((value) =>
              controller.options.some((item) => item.id === value),
            )
          )
            ctx.addIssue({
              code: "custom",
              path: ["departments", index, "questions", questionIndex, "when"],
              message:
                "Conditions must reference an earlier choice and a known option",
            });
        }
      }
    }
  });

export type InductionCycle = z.infer<typeof inductionCycleSchema>;
export type InductionDepartment = InductionCycle["departments"][number];
export type InductionQuestion = InductionDepartment["questions"][number];
export type LinkAnswer = { url: string; note: string };
export type AnswerValue = string | string[] | LinkAnswer[];
export type DepartmentAnswers = Record<string, AnswerValue>;
export type QuestionSnapshot = {
  id: string;
  label: string;
  type: string;
  options?: { id: string; label: string }[];
};

export function defineInductionCycle(
  input: z.input<typeof inductionCycleSchema>,
) {
  return inductionCycleSchema.parse(input);
}

// Accepts pasted profile links with or without the scheme and stores one canonical URL.
function profileLink(
  pattern: RegExp,
  canonical: (handle: string) => string,
  message: string,
) {
  return z
    .string()
    .trim()
    .max(200, message)
    .transform((value, ctx) => {
      const match = value
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./i, "")
        .match(pattern);
      if (!match) {
        ctx.addIssue({ code: "custom", message });
        return z.NEVER;
      }
      return canonical(match[1]);
    });
}

// ORCID iDs end in an ISO 7064 MOD 11-2 check character.
function validOrcid(id: string) {
  const digits = id.replaceAll("-", "");
  let total = 0;
  for (const digit of digits.slice(0, -1)) total = (total + Number(digit)) * 2;
  const check = (12 - (total % 11)) % 11;
  return digits.at(-1) === (check === 10 ? "X" : String(check));
}

const orcidPattern = /^(?:orcid\.org\/)?(\d{4}-\d{4}-\d{4}-\d{3}[\dX])\/?$/i;

// Pasted links often lack a scheme; only web links are accepted.
function webLink(message: string, optional = false) {
  return z
    .string()
    .trim()
    .max(500, "Use a shorter link")
    .transform((value, ctx) => {
      if (optional && !value) return "";
      try {
        const url = new URL(
          /^https?:\/\//i.test(value) ? value : `https://${value}`,
        );
        if (!/^https?:$/.test(url.protocol) || !url.hostname.includes("."))
          throw new Error();
        return url.href;
      } catch {
        ctx.addIssue({ code: "custom", message });
        return z.NEVER;
      }
    });
}

export const commonDetailsSchema = registrationSchema
  .pick({ name: true, email: true, phone: true, branch: true, year: true })
  .extend({
    rollNumber: registrationSchema.shape.rollNumber.transform((value) =>
      value.toUpperCase(),
    ),
    linkedinUrl: profileLink(
      /^(?:[a-z]{2}\.)?linkedin\.com\/in\/([A-Za-z0-9_%-]{3,100})\/?(?:[?#].*)?$/i,
      (handle) => `https://www.linkedin.com/in/${handle}`,
      "Enter your LinkedIn profile link, like linkedin.com/in/your-name",
    ),
    githubUrl: profileLink(
      /^github\.com\/([A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38})\/?(?:[?#].*)?$/i,
      (handle) => `https://github.com/${handle}`,
      "Enter your GitHub profile link, like github.com/your-username",
    ),
    orcidUrl: z
      .string()
      .trim()
      .max(200, "Enter your ORCID iD, like 0000-0002-1825-0097")
      .transform((value, ctx) => {
        if (!value) return "";
        const id = value
          .replace(/^https?:\/\//i, "")
          .replace(/^www\./i, "")
          .match(orcidPattern)?.[1]
          .toUpperCase();
        if (!id || !validOrcid(id)) {
          ctx.addIssue({
            code: "custom",
            message: "Enter your ORCID iD, like 0000-0002-1825-0097",
          });
          return z.NEVER;
        }
        return `https://orcid.org/${id}`;
      }),
    portfolioUrl: webLink(
      "Enter your portfolio or website link, like yourname.dev",
      true,
    ),
    otherClubs: z
      .string()
      .trim()
      .min(1, "List your other clubs, or write None")
      .max(1000, "Keep this under 1,000 characters"),
    whyGdgc: z
      .string()
      .trim()
      .min(1, "Tell us why you want to join GDGC")
      .max(2000, "Keep this under 2,000 characters"),
  })
  .strict();

export const commonQuestionLabels = {
  name: "Full name",
  email: "Institute email",
  rollNumber: "Roll number",
  phone: "Phone",
  branch: "Branch",
  year: "Year of study",
  linkedinUrl: "LinkedIn profile",
  githubUrl: "GitHub profile",
  orcidUrl: "ORCID iD (optional)",
  portfolioUrl: "Portfolio or personal website (optional)",
  otherClubs: "Other clubs you are part of",
  whyGdgc: "Why do you want to join GDGC?",
} as const;

export type CommonDetails = z.infer<typeof commonDetailsSchema>;
export type CommonDraft = Record<keyof CommonDetails, string>;
export const emptyCommonDetails: CommonDraft = {
  name: "",
  email: "",
  rollNumber: "",
  phone: "",
  branch: "",
  year: "",
  linkedinUrl: "",
  githubUrl: "",
  orcidUrl: "",
  portfolioUrl: "",
  otherClubs: "",
  whyGdgc: "",
};

export function isQuestionVisible(
  question: Pick<InductionQuestion, "when">,
  answers: Partial<DepartmentAnswers>,
) {
  if (!question.when) return true;
  const value = answers[question.when.questionId];
  return (
    typeof value === "string" && [question.when.equals].flat().includes(value)
  );
}

export function emptyAnswer(question: InductionQuestion): AnswerValue {
  if (question.type === "ranking")
    return question.options.map((item) => item.id);
  return question.type === "links" || question.type === "multi" ? [] : "";
}

const linkUrl = webLink("Enter a full link, like github.com/you/app");
const linkAnswer = (notes: boolean) =>
  z
    .object({
      url: linkUrl,
      note: z
        .string()
        .trim()
        .min(notes ? 1 : 0, "Say what this link shows")
        .max(200, "Keep this note under 200 characters"),
    })
    .strict();

export function visibleAnswers(
  department: InductionDepartment,
  answers: DepartmentAnswers,
): DepartmentAnswers {
  return Object.fromEntries(
    department.questions
      .filter((question) => isQuestionVisible(question, answers))
      .map((question) => [
        question.id,
        answers[question.id] ?? emptyAnswer(question),
      ]),
  );
}

function questionValueSchema(question: InductionQuestion) {
  if (question.type === "ranking") {
    const ids = question.options.map((item) => item.id);
    return z
      .array(z.string())
      .length(ids.length, "Rank all the fields")
      .refine(
        (values) =>
          new Set(values).size === ids.length &&
          values.every((value) => ids.includes(value)),
        "Rank each field exactly once",
      );
  }
  if (question.type === "choice")
    return z.enum(
      question.options.map((item) => item.id) as [string, ...string[]],
      "Choose an option",
    );
  if (question.type === "multi") {
    const ids = question.options.map((item) => item.id);
    return z
      .array(z.string())
      .min(question.required ? 1 : 0, "Choose at least one option")
      .refine(
        (values) =>
          new Set(values).size === values.length &&
          values.every((value) => ids.includes(value)),
        "Choose from the listed options",
      )
      .transform((values) => ids.filter((id) => values.includes(id)));
  }
  if (question.type === "links")
    return z
      .preprocess(
        // Rows left completely blank are ignored rather than rejected.
        (rows) =>
          Array.isArray(rows)
            ? rows.filter(
                (row) =>
                  !row ||
                  typeof row !== "object" ||
                  String(row.url ?? "").trim() ||
                  String(row.note ?? "").trim(),
              )
            : rows,
        z.array(linkAnswer(question.notes)),
      )
      .pipe(
        z
          .array(linkAnswer(question.notes))
          .min(question.required ? 1 : 0, "Add at least one link")
          .max(question.maxLinks, `Add up to ${question.maxLinks} links`),
      );
  return z
    .string()
    .trim()
    .min(question.required ? 1 : 0, "Answer this question")
    .max(
      question.maxLength,
      `Keep this under ${question.maxLength.toLocaleString("en-IN")} characters`,
    );
}

export function departmentAnswersSchema(department: InductionDepartment) {
  const shape = Object.fromEntries(
    department.questions.map((question) => {
      const field = questionValueSchema(question);
      return [
        question.id,
        question.when || !question.required ? field.optional() : field,
      ];
    }),
  );
  return z
    .object(shape)
    .strict()
    .superRefine((answers, ctx) => {
      for (const question of department.questions) {
        if (!question.when) continue;
        const shown = isQuestionVisible(question, answers as DepartmentAnswers);
        if (shown && question.required && answers[question.id] === undefined)
          ctx.addIssue({
            code: "custom",
            path: [question.id],
            message: "Answer this question",
          });
        if (!shown && answers[question.id] !== undefined)
          ctx.addIssue({
            code: "custom",
            path: [question.id],
            message: "This question does not apply to your answer",
          });
      }
    })
    .transform((answers): DepartmentAnswers =>
      Object.fromEntries(
        Object.entries(answers).filter(
          (entry): entry is [string, AnswerValue] => entry[1] !== undefined,
        ),
      ),
    );
}

export function formatDepartmentAnswer(
  value: AnswerValue | undefined,
  question: Pick<QuestionSnapshot, "type" | "options">,
) {
  if (question.type === "multi" && Array.isArray(value))
    return (value as string[])
      .map(
        (id) =>
          question.options?.find((option) => option.id === id)?.label ?? id,
      )
      .join(", ");
  if (question.type === "links" && Array.isArray(value))
    return (value as LinkAnswer[])
      .map((link) => `${link.note}: ${link.url}`)
      .join("\n");
  if (Array.isArray(value))
    return (value as string[])
      .map(
        (id, index) =>
          `${index + 1}. ${question.options?.find((option) => option.id === id)?.label ?? id}`,
      )
      .join("\n");
  if (question.type === "choice")
    return (
      question.options?.find((option) => option.id === value)?.label ??
      value ??
      ""
    );
  return value ?? "";
}

export function submissionSchema(cycle: InductionCycle) {
  return z
    .object({
      version: z.number().int(),
      common: commonDetailsSchema,
      // Order is the applicant's preference.
      applications: z
        .array(
          z.object({ departmentId: z.string(), answers: z.unknown() }).strict(),
        )
        .min(1, "Choose at least one domain")
        .max(
          cycle.maxDepartments,
          `Choose up to ${cycle.maxDepartments} domains`,
        )
        .transform((applications, ctx) => {
          const parsed: {
            department: InductionDepartment;
            answers: DepartmentAnswers;
          }[] = [];
          for (const [index, application] of applications.entries()) {
            const department = cycle.departments.find(
              (item) => item.id === application.departmentId,
            );
            const answers =
              department &&
              departmentAnswersSchema(department).safeParse(
                application.answers,
              );
            if (
              !department?.applications ||
              !answers?.success ||
              parsed.some((item) => item.department.id === department.id)
            ) {
              ctx.addIssue({
                code: "custom",
                path: [index],
                message: "Check this domain's answers",
              });
              return z.NEVER;
            }
            parsed.push({ department, answers: answers.data });
          }
          return parsed;
        }),
      leaveBlank: z.string().max(200).optional(),
    })
    .strict();
}

export type InductionResult =
  | {
      ok: true;
      status: "created" | "duplicate";
      // Departments from this request that are now on file.
      departments: string[];
      remaining: number;
    }
  | {
      ok: false;
      error: string;
      code?: "stale" | "closed" | "invalid" | "limited" | "full";
    };
