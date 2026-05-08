import { defineCollection, z } from "astro:content";

const TOPIC = z.enum([
  "world-models",
  "llms",
  "vision",
  "medical-ai",
  "wireless-sensing",
  "social-econ",
  "hci",
]);
export type Topic = z.infer<typeof TOPIC>;

const author = z.object({
  name: z.string(),
  url: z.string().url().optional(),
  isMe: z.boolean().optional(),
  equalContrib: z.boolean().optional(),
});

const papers = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    venue: z.string(),
    venueExtra: z.string().optional(),
    year: z.number().int(),
    date: z.string(),
    authors: z.array(author).min(1),
    topics: z.array(TOPIC).min(1),
    summary: z.string().min(20).max(400),
    featured: z.boolean().default(false),
    thumbnail: z.string(),
    bibtex: z.string().optional(),
    links: z.object({
      paper: z.string().url().optional(),
      code: z.string().url().optional(),
      project: z.string().url().optional(),
    }),
  }),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    collaborator: z.string().optional(),
    period: z.string(),
    status: z.enum(["shipped", "in-progress"]),
    statusDetail: z.string().optional(),
    topics: z.array(TOPIC).min(1),
    summary: z.string().min(20).max(400),
    thumbnail: z.string(),
    links: z
      .object({
        site: z.string().url().optional(),
        github: z.string().url().optional(),
        store: z.string().url().optional(),
        paper: z.string().url().optional(),
      })
      .optional(),
    sortKey: z.number().default(0),
  }),
});

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.string(),
    dek: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const news = defineCollection({
  type: "content",
  schema: z.object({ title: z.string() }),
});

const teaching = defineCollection({
  type: "content",
  schema: z.object({ title: z.string() }),
});

export const collections = { papers, projects, posts, news, teaching };
