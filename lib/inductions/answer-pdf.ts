// Builds the applicant's own copy of a submitted application in the browser.
// jsPDF and the fonts load only when someone asks for the file.
import {
  commonQuestionLabels,
  formatDepartmentAnswer,
  type AnswerValue,
  type CommonDetails,
  type LinkAnswer,
} from "./schema";

export type AnswerCopy = {
  submittedAt: string;
  common: CommonDetails;
  applications: {
    title: string;
    color: string;
    questions: {
      label: string;
      type: string;
      options?: { id: string; label: string }[];
      answer: AnswerValue | undefined;
    }[];
  }[];
};

const ordinal = ["First", "Second", "Third", "Fourth"];
const page = { width: 595.28, height: 841.89, margin: 56 };
const ink: [number, number, number] = [32, 33, 36];
const muted: [number, number, number] = [95, 99, 104];
const line: [number, number, number] = [218, 220, 224];

async function fetchBase64(url: string) {
  const bytes = new Uint8Array(await (await fetch(url)).arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000)
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

// The bundled Latin subset lacks arrows and emoji; keep the text readable without them.
function printable(text: string) {
  return text
    .replaceAll("→", "->")
    .replace(/\p{Extended_Pictographic}️?/gu, "")
    .replace(/\r\n?/g, "\n");
}

function hex(color: string): [number, number, number] {
  const value = Number.parseInt(color.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

// The loader is swappable so the layout can be rendered outside a browser.
export async function answerPdf(
  copy: AnswerCopy,
  load: (url: string) => Promise<string> = fetchBase64,
) {
  const [{ jsPDF }, regular, semibold, logo] = await Promise.all([
    import("jspdf"),
    load("/inductions/fonts/InstrumentSans-Regular.ttf"),
    load("/inductions/fonts/InstrumentSans-SemiBold.ttf"),
    load("/inductions/gdgc-logo.png"),
  ]);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.addFileToVFS("InstrumentSans-Regular.ttf", regular);
  doc.addFileToVFS("InstrumentSans-SemiBold.ttf", semibold);
  doc.addFont("InstrumentSans-Regular.ttf", "Instrument", "normal");
  doc.addFont("InstrumentSans-SemiBold.ttf", "Instrument", "bold");
  doc.setProperties({
    title: "Your GDGC application",
    author: "GDG on Campus NIT Jalandhar",
  });

  const width = page.width - page.margin * 2;
  const bottom = page.height - 64;
  let y = 0;

  function header() {
    doc.addImage(
      `data:image/png;base64,${logo}`,
      "PNG",
      page.margin,
      34,
      34,
      17.6,
    );
    doc
      .setFont("Instrument", "bold")
      .setFontSize(10)
      .setTextColor(...ink);
    doc.text("GDG on Campus", page.margin + 44, 46);
    // Measured in the bold face it was drawn in.
    const brand = doc.getTextWidth("GDG on Campus") + 4;
    doc.setFont("Instrument", "normal").setTextColor(...muted);
    doc.text("NIT Jalandhar", page.margin + 44 + brand, 46);
    y = 92;
  }
  function ensure(height: number) {
    if (y + height <= bottom) return;
    doc.addPage();
    header();
  }
  function write(
    text: string,
    options: {
      size?: number;
      bold?: boolean;
      color?: [number, number, number];
      after?: number;
      indent?: number;
    } = {},
  ) {
    const size = options.size ?? 10.5;
    const indent = options.indent ?? 0;
    doc.setFont("Instrument", options.bold ? "bold" : "normal");
    doc.setFontSize(size).setTextColor(...(options.color ?? ink));
    const leading = size * 1.45;
    for (const row of doc.splitTextToSize(printable(text), width - indent)) {
      ensure(leading);
      doc.text(row, page.margin + indent, y + size);
      y += leading;
    }
    y += options.after ?? 0;
  }
  function rule(gap = 14) {
    ensure(gap * 2);
    y += gap;
    doc.setDrawColor(...line).setLineWidth(0.6);
    doc.line(page.margin, y, page.margin + width, y);
    y += gap;
  }

  header();
  write("YOUR APPLICATION", { size: 9, color: muted, after: 6 });
  write("A copy of what you submitted", { size: 22, bold: true, after: 6 });
  write(
    `Submitted ${new Date(copy.submittedAt).toLocaleString("en-IN", {
      dateStyle: "long",
      timeStyle: "short",
    })}`,
    { color: muted, after: 4 },
  );
  write(
    "This is your own copy of what you submitted. Submitting does not confirm selection; shortlisting and an offline round follow.",
    { size: 9, color: muted },
  );
  rule();

  write("About you", { size: 14, bold: true, after: 8 });
  for (const [key, label] of Object.entries(commonQuestionLabels)) {
    const value = copy.common[key as keyof CommonDetails];
    if (!value) continue;
    ensure(34);
    write(label.replace(" (optional)", ""), { size: 9, color: muted });
    write(value, { after: 7 });
  }

  for (const [index, application] of copy.applications.entries()) {
    rule(16);
    ensure(60);
    doc.setFillColor(...hex(application.color));
    doc.rect(page.margin, y, 24, 3, "F");
    y += 12;
    write(`${ordinal[index] ?? `#${index + 1}`} choice`, {
      size: 9,
      color: muted,
      after: 2,
    });
    write(application.title, { size: 16, bold: true, after: 10 });
    for (const question of application.questions) {
      ensure(40);
      write(question.label, { bold: true, after: 3 });
      if (question.type === "links" && Array.isArray(question.answer)) {
        for (const link of question.answer as LinkAnswer[]) {
          write(link.note, { color: muted });
          doc.setFont("Instrument", "normal").setFontSize(10.5);
          doc.setTextColor(25, 103, 210);
          for (const row of doc.splitTextToSize(printable(link.url), width)) {
            ensure(16);
            doc.textWithLink(row, page.margin, y + 10.5, { url: link.url });
            y += 10.5 * 1.45;
          }
          y += 4;
        }
        y += 8;
        continue;
      }
      write(formatDepartmentAnswer(question.answer, question) || "No answer", {
        color: question.answer ? ink : muted,
        after: 12,
      });
    }
  }

  const pages = doc.getNumberOfPages();
  for (let number = 1; number <= pages; number++) {
    doc.setPage(number);
    doc
      .setFont("Instrument", "normal")
      .setFontSize(9)
      .setTextColor(...muted);
    doc.text(
      `Page ${number} of ${pages}`,
      page.width - page.margin,
      page.height - 34,
      {
        align: "right",
      },
    );
  }
  return doc;
}

export async function downloadAnswerPdf(copy: AnswerCopy, filename: string) {
  (await answerPdf(copy)).save(filename);
}
