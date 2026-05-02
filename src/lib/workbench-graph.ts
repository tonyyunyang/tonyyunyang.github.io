import type { Topic } from "~/content/config";

export interface PaperLite {
  slug: string;
  title: string;
  venue: string;
  year: number;
  topics: Topic[];
}

export interface ProjectLite {
  slug: string;
  title: string;
  topics: Topic[];
  sortKey: number;
}

export interface GraphInput {
  papers: PaperLite[];
  projects: ProjectLite[];
}

export type NodeKind = "topic" | "paper" | "project";

export interface GraphNode {
  id: string;
  label: string;
  kind: NodeKind;
  meta?: string;
  href?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const TOPIC_LABELS: Record<Topic, string> = {
  "world-models": "world models",
  "llms": "LLMs",
  "vision": "vision",
  "medical-ai": "medical AI",
  "wireless-sensing": "wireless sensing",
};

export function buildGraph({ papers, projects }: GraphInput): Graph {
  const topicSet = new Set<Topic>();
  for (const p of papers) p.topics.forEach((t) => topicSet.add(t));
  for (const p of projects) p.topics.forEach((t) => topicSet.add(t));

  const counts = new Map<Topic, number>();
  for (const t of topicSet) counts.set(t, 0);
  for (const p of papers) p.topics.forEach((t) => counts.set(t, counts.get(t)! + 1));
  for (const p of projects) p.topics.forEach((t) => counts.set(t, counts.get(t)! + 1));

  const sortedTopics = [...topicSet].sort((a, b) => {
    const diff = counts.get(b)! - counts.get(a)!;
    return diff !== 0 ? diff : a.localeCompare(b);
  });

  const topicNodes: GraphNode[] = sortedTopics.map((t) => ({
    id: t,
    label: TOPIC_LABELS[t],
    kind: "topic",
  }));

  const paperNodes: GraphNode[] = papers.map((p) => ({
    id: `paper:${p.slug}`,
    label: p.title,
    kind: "paper",
    meta: `${p.venue} '${String(p.year).slice(2)}`,
    href: `#paper-${p.slug}`,
  }));

  const projectNodes: GraphNode[] = [...projects]
    .sort((a, b) => b.sortKey - a.sortKey)
    .map((p) => ({
      id: `project:${p.slug}`,
      label: p.title,
      kind: "project",
      href: `#project-${p.slug}`,
    }));

  const edges: GraphEdge[] = [];
  for (const p of papers) {
    for (const t of p.topics) edges.push({ from: t, to: `paper:${p.slug}` });
  }
  for (const p of projects) {
    for (const t of p.topics) edges.push({ from: t, to: `project:${p.slug}` });
  }

  return {
    nodes: [...topicNodes, ...paperNodes, ...projectNodes],
    edges,
  };
}
