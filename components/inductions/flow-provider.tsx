"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  emptyCommonDetails,
  type DepartmentAnswers,
  type CommonDraft,
} from "@/lib/inductions/schema";

type Draft = {
  common: CommonDraft;
  // Order is the applicant's preference.
  selected: string[];
  answers: Record<string, DepartmentAnswers>;
  step: number;
  // Departments saved this session, keyed by normalized email.
  received: Record<string, string[]>;
};
type Flow = Omit<Draft, "received"> & {
  restored: boolean;
  setCommon: (value: CommonDraft) => void;
  setSelected: (value: string[]) => void;
  saveAnswers: (department: string, values: DepartmentAnswers) => void;
  setStep: (value: number) => void;
  received: string[];
  markReceived: (departments: string[], email: string) => void;
};
const Context = createContext<Flow | null>(null);
const emptyDraft = (): Draft => ({
  common: { ...emptyCommonDetails },
  selected: [],
  answers: {},
  step: 0,
  received: {},
});

export function InductionFlowProvider({
  storageKey,
  children,
}: {
  storageKey: string;
  children: ReactNode;
}) {
  const [draft, setDraft] = useState(emptyDraft);
  const [restored, setRestored] = useState(false);

  // Session storage survives a refresh in this tab only and is cleared when it closes.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const value = JSON.parse(saved) as Partial<Draft>;
        // Restoring after hydration keeps the server HTML and first client render identical.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDraft((current) => ({
          ...current,
          ...value,
          common: { ...current.common, ...value.common },
        }));
      }
    } catch {}
    setRestored(true);
  }, [storageKey]);
  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(draft));
    } catch {}
  }, [draft, restored, storageKey]);

  const update = (change: Partial<Draft>) =>
    setDraft((current) => ({ ...current, ...change }));
  const email = draft.common.email.trim().toLowerCase();
  return (
    <Context.Provider
      value={{
        ...draft,
        restored,
        setCommon: (common) => update({ common }),
        setSelected: (selected) => update({ selected }),
        saveAnswers: (department, values) =>
          setDraft((current) => ({
            ...current,
            answers: { ...current.answers, [department]: values },
          })),
        setStep: (step) => update({ step }),
        received: draft.received[email] ?? [],
        markReceived: (departments, submittedEmail) =>
          setDraft((current) => ({
            ...current,
            selected: [],
            answers: {},
            received: {
              ...current.received,
              [submittedEmail]: [
                ...new Set([
                  ...(current.received[submittedEmail] ?? []),
                  ...departments,
                ]),
              ],
            },
          })),
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useInductionFlow() {
  const flow = useContext(Context);
  if (!flow)
    throw new Error("Induction forms require their application layout");
  return flow;
}
