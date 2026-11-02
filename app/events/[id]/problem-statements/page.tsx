import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProblemStatementsView } from "@/components/events/problem-statements-view";
import { HomeFooter } from "@/components/home/footer";
import { HomeMotion } from "@/components/home/home-motion";
import { allEvents } from "@/lib/content/home";
import { getProblemStatements } from "@/lib/content/problem-statements";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return [{ id: "minimol" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = allEvents.find((item) => item.id === id);
  const problemData = getProblemStatements(id);

  if (!event || !problemData) {
    return {};
  }

  return {
    title: `Problem Statements · ${event.title} · GDGC NITJ`,
    description: problemData.description,
  };
}

export default async function ProblemStatementsPage({ params }: Props) {
  const { id } = await params;
  const event = allEvents.find((item) => item.id === id);
  const problemData = getProblemStatements(id);

  if (!event || !problemData) {
    notFound();
  }

  return (
    <HomeMotion>
      <ProblemStatementsView event={event} problemData={problemData} />
      <HomeFooter />
    </HomeMotion>
  );
}

