import { describe, it, expect } from "vitest";
import { buildGraph, type GraphInput } from "~/lib/workbench-graph";

const sample: GraphInput = {
  papers: [
    {
      slug: "through-the-eyes",
      title: "Through the Eyes of Emotion",
      venue: "IMWUT",
      year: 2025,
      topics: ["vision"],
    },
    {
      slug: "reverse-imaging",
      title: "Reverse Imaging",
      venue: "MICCAI",
      year: 2025,
      topics: ["medical-ai", "vision"],
    },
  ],
  projects: [
    {
      slug: "scholarhighlights",
      title: "ScholarHighlights",
      topics: ["llms"],
      sortKey: 5,
    },
    {
      slug: "llm-router",
      title: "LLM Router",
      topics: ["llms"],
      sortKey: 4,
    },
  ],
};

describe("buildGraph", () => {
  it("emits one node per topic that appears", () => {
    const graph = buildGraph(sample);
    const topics = graph.nodes
      .filter((n) => n.kind === "topic")
      .map((n) => n.id);
    expect(topics).toEqual(expect.arrayContaining(["vision", "medical-ai", "llms"]));
    expect(topics).not.toContain("world-models");
    expect(topics).not.toContain("wireless-sensing");
  });

  it("emits one node per paper and project", () => {
    const graph = buildGraph(sample);
    const outputs = graph.nodes
      .filter((n) => n.kind !== "topic")
      .map((n) => n.id);
    expect(outputs.sort()).toEqual([
      "paper:reverse-imaging",
      "paper:through-the-eyes",
      "project:llm-router",
      "project:scholarhighlights",
    ]);
  });

  it("emits an edge for each (topic, output) pair", () => {
    const graph = buildGraph(sample);
    expect(graph.edges).toContainEqual({ from: "vision", to: "paper:through-the-eyes" });
    expect(graph.edges).toContainEqual({ from: "vision", to: "paper:reverse-imaging" });
    expect(graph.edges).toContainEqual({ from: "medical-ai", to: "paper:reverse-imaging" });
    expect(graph.edges).toContainEqual({ from: "llms", to: "project:llm-router" });
  });

  it("orders topic nodes by total connection count desc", () => {
    const graph = buildGraph(sample);
    const topics = graph.nodes.filter((n) => n.kind === "topic");
    expect(topics[topics.length - 1].id).toBe("medical-ai");
  });
});
