"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnswerValue, InductionQuestion } from "@/lib/inductions/schema";

function Ranking({
  id,
  question,
  value,
  onChange,
}: {
  id: string;
  question: Extract<InductionQuestion, { type: "ranking" }>;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [dragged, setDragged] = useState<string>();
  const [announcement, setAnnouncement] = useState("");
  const list = useRef<HTMLOListElement>(null);
  const previousPositions = useRef(new Map<string, number>());
  const movement = useRef<Animation[]>([]);

  useLayoutEffect(() => {
    const previous = previousPositions.current;
    previousPositions.current = new Map();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    list.current
      ?.querySelectorAll<HTMLElement>("[data-option-id]")
      .forEach((item) => {
        const oldTop = previous.get(item.dataset.optionId!);
        if (oldTop === undefined) return;
        const distance = oldTop - item.getBoundingClientRect().top;
        if (distance && item.animate)
          movement.current.push(
            item.animate(
              [
                { transform: `translateY(${distance}px)` },
                { transform: "translateY(0)" },
              ],
              { duration: 190, easing: "cubic-bezier(0.2, 0, 0, 1)" },
            ),
          );
      });
    return () => {
      movement.current.forEach((animation) => animation.cancel());
      movement.current = [];
    };
  }, [value]);
  function move(optionId: string, to: number, control?: "up" | "down") {
    const from = value.indexOf(optionId);
    if (from < 0 || to < 0 || to >= value.length || from === to) return;
    movement.current.forEach((animation) => animation.cancel());
    previousPositions.current = new Map(
      Array.from(
        list.current?.querySelectorAll<HTMLElement>("[data-option-id]") ?? [],
        (item) => [item.dataset.optionId!, item.getBoundingClientRect().top],
      ),
    );
    const next = [...value];
    next.splice(from, 1);
    next.splice(to, 0, optionId);
    onChange(next);
    if (control)
      requestAnimationFrame(() => {
        const direction =
          to === 0 ? "down" : to === value.length - 1 ? "up" : control;
        document
          .getElementById(`${id}-${optionId}-${direction}`)
          ?.focus({ preventScroll: true });
      });
    const label = question.options.find(
      (option) => option.id === optionId,
    )?.label;
    setAnnouncement(
      `${label} moved to preference ${to + 1} of ${next.length}.`,
    );
  }
  return (
    <>
      <ol
        ref={list}
        className="induction-ranking"
        aria-label="Preference order"
      >
        {value.map((optionId, index) => {
          const option = question.options.find((item) => item.id === optionId)!;
          return (
            <li
              key={optionId}
              data-option-id={optionId}
              data-dragging={dragged === optionId ? "" : undefined}
              onDragOver={(event) => {
                if (dragged) event.preventDefault();
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (dragged) move(dragged, index);
                setDragged(undefined);
              }}
            >
              <button
                className="induction-drag-handle"
                type="button"
                tabIndex={-1}
                draggable
                aria-label={`Drag ${option.label}`}
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", optionId);
                  setDragged(optionId);
                }}
                onDragEnd={() => setDragged(undefined)}
              >
                <GripVertical size={18} aria-hidden="true" />
              </button>
              <span className="induction-ranking-number" aria-hidden="true">
                {index + 1}
              </span>
              <span className="induction-ranking-label">{option.label}</span>
              <div className="induction-ranking-controls">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={index === 0}
                  id={`${id}-${optionId}-up`}
                  aria-label={`Move ${option.label} up`}
                  onClick={() => move(optionId, index - 1, "up")}
                >
                  <ArrowUp size={16} aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={index === value.length - 1}
                  id={`${id}-${optionId}-down`}
                  aria-label={`Move ${option.label} down`}
                  onClick={() => move(optionId, index + 1, "down")}
                >
                  <ArrowDown size={16} aria-hidden="true" />
                </Button>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="sr-only" role="status" id={`${id}-order-status`}>
        {announcement}
      </p>
    </>
  );
}

export function QuestionInput({
  id,
  question,
  value,
  onChange,
  error,
}: {
  id: string;
  question: InductionQuestion;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
  error?: string;
}) {
  const hint = question.hint;
  const describedBy = error || hint ? `${id}-message` : undefined;
  const label = `${question.label}${question.required ? "" : " (optional)"}`;
  const message = (hint || error) && (
    <p
      id={`${id}-message`}
      className={error ? "club-form-error" : "club-form-hint"}
    >
      {error ?? hint}
    </p>
  );
  if (question.type === "choice" || question.type === "ranking") {
    return (
      <fieldset
        id={id}
        tabIndex={-1}
        className="club-form-field induction-question-group induction-question"
        data-invalid={error ? "" : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      >
        <legend>{label}</legend>
        {message}
        {question.type === "ranking" ? (
          <Ranking
            id={id}
            question={question}
            value={
              Array.isArray(value)
                ? value
                : question.options.map((option) => option.id)
            }
            onChange={onChange}
          />
        ) : (
          <div className="induction-choices">
            {question.options.map((option) => (
              <label className="induction-choice" key={option.id}>
                <input
                  type="radio"
                  name={id}
                  value={option.id}
                  checked={value === option.id}
                  required={question.required}
                  onChange={() => onChange(option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </fieldset>
    );
  }
  const props = {
    id,
    name: question.id,
    value: typeof value === "string" ? value : "",
    required: question.required,
    maxLength: question.maxLength,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(event.target.value),
  };
  return (
    <div
      className="club-form-field induction-question"
      data-invalid={error ? "" : undefined}
    >
      <label htmlFor={id}>{label}</label>
      {question.type === "text" ? (
        <input {...props} type="text" />
      ) : (
        <textarea {...props} rows={5} />
      )}
      {message}
    </div>
  );
}
