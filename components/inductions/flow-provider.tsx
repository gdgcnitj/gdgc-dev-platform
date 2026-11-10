"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  emptyCommonDetails,
  type DepartmentAnswers,
  type CommonDraft,
} from "@/lib/inductions/schema";

type Flow = {
  common: CommonDraft;
  setCommon: (value: CommonDraft) => void;
  commonReady: boolean;
  setCommonReady: (value: boolean) => void;
  drafts: Record<string, DepartmentAnswers>;
  saveDraft: (department: string, values: DepartmentAnswers) => void;
  received: string[];
  markReceived: (department: string, email: string) => void;
};
const Context = createContext<Flow | null>(null);

export function InductionFlowProvider({ children }: { children: ReactNode }) {
  const [common, setCommon] = useState<CommonDraft>({ ...emptyCommonDetails });
  const [commonReady, setCommonReady] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, DepartmentAnswers>>({});
  const [submitted, setSubmitted] = useState<Record<string, string[]>>({});
  const email = common.email.trim().toLowerCase();
  return (
    <Context.Provider
      value={{
        common,
        setCommon,
        commonReady,
        setCommonReady,
        drafts,
        saveDraft: (department, values) =>
          setDrafts((current) => ({ ...current, [department]: values })),
        received: submitted[email] ?? [],
        markReceived: (department, submittedEmail) => {
          setSubmitted((current) => ({
            ...current,
            [submittedEmail]: [
              ...new Set([...(current[submittedEmail] ?? []), department]),
            ],
          }));
          setDrafts((current) => ({ ...current, [department]: {} }));
        },
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
