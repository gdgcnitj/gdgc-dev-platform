// Builds one expectations PDF per department from the induction content.
// Run: npm run inductions:pdfs (needs XeLaTeX, for example MacTeX or TeX Live).
import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
  copyFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inductionCycles } from "@/lib/content/inductions";
import {
  expectationsManifestPath,
  expectationsPdfHref,
} from "@/lib/inductions/expectations-pdf";
import { getDepartment } from "@/lib/content/departments";
import {
  departmentLead,
  expectationsDigest,
  type ExpectationsManifest,
} from "./digest";
import { palette } from "@/lib/design/theme";
import type { InductionDepartment } from "@/lib/inductions/schema";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

// Instrument Sans has no arrow glyph; math mode supplies one.
function tex(value: string) {
  return value
    .replace(/[\\{}&%$#_~^]/g, (char) =>
      char === "\\"
        ? "\\textbackslash{}"
        : char === "~"
          ? "\\textasciitilde{}"
          : char === "^"
            ? "\\textasciicircum{}"
            : `\\${char}`,
    )
    .replaceAll("→", "$\\rightarrow$");
}

function list(items: string[]) {
  return `\\begin{itemize}\n${items.map((item) => `  \\item ${tex(item)}`).join("\n")}\n\\end{itemize}`;
}

function document(department: InductionDepartment) {
  const identity = getDepartment(department.id)!;
  const lead = departmentLead(department.id);
  const content = department.expectations!;
  const accent = palette[identity.color].slice(1);
  const groups = (
    items: NonNullable<InductionDepartment["expectations"]>["groups"],
  ) =>
    items
      .map(
        (group) =>
          // Keep the group heading, introduction, and first topic together.
          // Longer groups may still break between subsequent topics.
          `\\group{${Math.min(group.items.length + 3 + (group.sections?.[0] ? group.sections[0].items.length + 4 : 0), 14)}}{${tex(group.title)}}\n${list(group.items)}\n${(
            group.sections ?? []
          )
            .map(
              (section) =>
                `\\subgroup{${tex(section.title)}}\n${list(section.items)}`,
            )
            .join("\n")}`,
      )
      .join("\n\n");
  // Tracks sit side by side in pairs, so four short lists fit beside each other.
  const tracks = (
    items: NonNullable<InductionDepartment["expectations"]>["groups"],
  ) =>
    Array.from({ length: Math.ceil(items.length / 2) }, (_, row) =>
      items
        .slice(row * 2, row * 2 + 2)
        .map(
          (track) =>
            `\\begin{minipage}[t]{0.475\\linewidth}\\raggedright\n\\group{0}{${tex(track.title)}}\n${list(track.items)}\n\\end{minipage}`,
        )
        .join("\\hfill\n"),
    ).join("\n\n\\par\\vspace{4pt}\n");
  return String.raw`\documentclass[10.5pt]{article}
\usepackage[a4paper,top=20mm,bottom=22mm,left=22mm,right=22mm,headheight=14mm,headsep=7mm]{geometry}
\usepackage{fontspec}
\usepackage{xcolor}
\usepackage{graphicx}
\usepackage{enumitem}
\usepackage{fancyhdr}
\usepackage{lastpage}
\usepackage{needspace}

\setmainfont{InstrumentSans}[
  Path=./fonts/,
  Extension=.ttf,
  UprightFont=*-Regular,
  BoldFont=*-SemiBold,
  ItalicFont=*-Italic,
  FontFace={md}{n}{*-Medium},
  FontFace={b}{n}{*-Bold},
]
\newcommand{\medium}{\fontseries{md}\selectfont}

\definecolor{accent}{HTML}{${accent}}
\definecolor{ink}{HTML}{202124}
\definecolor{muted}{HTML}{5F6368}
\definecolor{line}{HTML}{DADCE0}
\color{ink}

% Document info goes straight to xdvipdfmx; this avoids hyperref's newer kernel requirements.
\special{pdf:docinfo<</Title (${tex(identity.inductionTitle)} expectations) /Author (GDG on Campus NIT Jalandhar) /Subject (Induction expectations)>>}

\setlength{\parindent}{0pt}
\setlength{\parskip}{0pt}
\linespread{1.18}
\raggedright

\setlist[itemize]{
  leftmargin=14pt, labelsep=7pt, itemsep=2pt, topsep=3pt, parsep=0pt,
  label={\textcolor{accent}{\raisebox{0.18ex}{\rule{3.4pt}{3.4pt}}}}
}

\newcommand{\group}[2]{\Needspace{#1\baselineskip}\vspace{12pt}{\fontsize{13}{16}\selectfont\bfseries #2\par}\vspace{2pt}}
\newcommand{\subgroup}[1]{\Needspace{5\baselineskip}\vspace{9pt}{\small\medium\color{muted}#1\par}}

\pagestyle{fancy}
\fancyhf{}
\renewcommand{\headrulewidth}{0pt}
\fancyhead[L]{\raisebox{-0.35\height}{\includegraphics[height=8mm]{gdgc-logo.pdf}}\hspace{9pt}{\small\medium GDG on Campus}\,{\small\color{muted}NIT Jalandhar}}
\fancyfoot[L]{\footnotesize\color{muted}${tex(identity.inductionTitle)} · Domain expectations}
\fancyfoot[R]{\footnotesize\color{muted}Page \thepage\ of \pageref{LastPage}}

\begin{document}

{\color{accent}\rule{36pt}{3pt}}\par\vspace{9pt}
{\small\medium\color{muted}DOMAIN EXPECTATIONS}\par\vspace{6pt}
{\fontsize{30}{34}\selectfont\bfseries ${tex(identity.inductionTitle)}\par}\vspace{8pt}
${lead ? `{\\color{muted}Led by }{\\medium ${tex(lead)}}\\par\\vspace{6pt}` : ""}
{\large\color{muted}${tex(department.preview)}\par}
\vspace{10pt}
{\color{line}\rule{\linewidth}{0.5pt}}\par

${content.intro ? `\\vspace{14pt}{\\color{muted}${tex(content.intro)}\\par}` : ""}

${groups(content.groups)}

${
  content.tracks
    ? `\\vspace{14pt}{\\color{line}\\rule{\\linewidth}{0.5pt}}\\par\\vspace{4pt}
{\\fontsize{15}{19}\\selectfont\\bfseries Tracks\\par}
${content.tracksIntro ? `\\vspace{4pt}{\\color{muted}${tex(content.tracksIntro)}\\par}` : ""}
${tracks(content.tracks)}`
    : ""
}

${content.outro ? `\\vspace{16pt}{\\medium ${tex(content.outro)}\\par}` : ""}

\vfill
\vspace{12pt}
{\color{line}\rule{\linewidth}{0.5pt}}\par\vspace{6pt}
{\footnotesize\color{muted}Submitting an application does not confirm selection. Shortlisting and an offline round follow, and their date, time, and venue will be announced.\par}

\end{document}
`;
}

const work = mkdtempSync(join(tmpdir(), "gdgc-expectations-"));
try {
  copyFileSync(join(here, "gdgc-logo.pdf"), join(work, "gdgc-logo.pdf"));
  mkdirSync(join(work, "fonts"));
  for (const weight of ["Regular", "Medium", "SemiBold", "Bold", "Italic"])
    copyFileSync(
      join(here, "fonts", `InstrumentSans-${weight}.ttf`),
      join(work, "fonts", `InstrumentSans-${weight}.ttf`),
    );
  for (const cycle of inductionCycles) {
    const manifest: ExpectationsManifest = {};
    for (const department of cycle.departments) {
      if (!department.expectations) continue;
      writeFileSync(join(work, `${department.id}.tex`), document(department));
      // Two passes resolve the total page count in the footer.
      for (let pass = 0; pass < 2; pass++) {
        const run = spawnSync(
          "xelatex",
          [
            "-interaction=nonstopmode",
            "-halt-on-error",
            `${department.id}.tex`,
          ],
          { cwd: work, encoding: "utf8" },
        );
        if (run.error)
          throw new Error("Install XeLaTeX to build expectation PDFs.");
        if (run.status !== 0)
          throw new Error(
            `${department.id}.tex failed:\n${run.stdout.split("\n").slice(-30).join("\n")}`,
          );
        if (pass && /Missing character/.test(run.stdout))
          throw new Error(
            `${department.id}.tex uses a character the font lacks.`,
          );
      }
      const target = join(
        root,
        "public",
        expectationsPdfHref(cycle.id, department.id),
      );
      mkdirSync(dirname(target), { recursive: true });
      copyFileSync(join(work, `${department.id}.pdf`), target);
      manifest[department.id] = expectationsDigest(department);
      console.log(`wrote ${target}`);
    }
    writeFileSync(
      join(root, "public", expectationsManifestPath(cycle.id)),
      `${JSON.stringify(manifest, null, 2)}\n`,
    );
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
