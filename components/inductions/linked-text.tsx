import { telHref } from "@/lib/content/inductions/contacts";

// Web addresses and +91 phone numbers in a lead's note become links.
export function LinkedText({ text }: { text: string }) {
  return text
    .split(/(https:\/\/[^\s,]+|\+91 \d{5} \d{5})/)
    .map((part, index) =>
      index % 2 ? (
        <a
          key={part}
          href={part.startsWith("+") ? telHref(part) : part}
          {...(part.startsWith("+")
            ? {}
            : { target: "_blank", rel: "noreferrer" })}
        >
          {part.replace(/^https:\/\//, "")}
        </a>
      ) : (
        part
      ),
    );
}
