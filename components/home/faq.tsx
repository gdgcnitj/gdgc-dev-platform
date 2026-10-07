import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { commonQuestions, socialLinks } from "@/lib/content/home";

export function HomeFaq() {
  return (
    <section
      id="questions"
      className="club-section club-container club-questions"
      aria-labelledby="questions-title"
    >
      <div className="club-questions-heading">
        <h2 id="questions-title">Common questions.</h2>
        <p>Joining the chapter, choosing a department, and taking part.</p>
        <a
          className="club-text-link"
          href={socialLinks.instagram}
          target="_blank"
          rel="noreferrer"
        >
          Ask the team <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="club-faq">
        {commonQuestions.map((item, index) => (
          <details key={item.question} name="club-questions" open={index === 0}>
            <summary>
              {item.question}
              <span className="club-faq-toggle" aria-hidden="true">
                <Plus className="club-faq-plus" size={18} />
                <Minus className="club-faq-minus" size={18} />
              </span>
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
