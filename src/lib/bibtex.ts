import type { CollectionEntry } from "astro:content";

type PaperData = CollectionEntry<"papers">["data"];
type PaperAuthor = PaperData["authors"][number];

const STOP_WORDS = new Set([
  "a", "an", "the", "of", "on", "in", "for", "with", "to",
  "and", "or", "but", "at", "by", "from", "as", "is", "are",
]);

function asciiFold(input: string): string {
  return input.normalize("NFKD").replace(/[̀-ͯ]/g, "");
}

function lastName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts[parts.length - 1] ?? fullName;
}

function firstName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts.slice(0, -1).join(" ");
}

function bibAuthor(fullName: string): string {
  const last = lastName(fullName);
  const first = firstName(fullName);
  return first ? `${last}, ${first}` : last;
}

function firstSignificantTitleWord(title: string): string {
  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/gi, " ")
    .split(/\s+/)
    .filter(Boolean);
  for (const w of words) {
    if (!STOP_WORDS.has(w) && w.length > 1) return w;
  }
  return words[0] ?? "paper";
}

function generateKey(data: PaperData): string {
  const firstAuthor = data.authors[0]?.name ?? "anon";
  const last = asciiFold(lastName(firstAuthor)).toLowerCase().replace(/[^a-z0-9]/g, "");
  const word = firstSignificantTitleWord(data.title);
  return `${last}${data.year}${word}`;
}

export function generateBibtex(data: PaperData): string {
  const authors = data.authors.map((a: PaperAuthor) => bibAuthor(a.name)).join(" and ");
  const key = generateKey(data);
  const venue = data.venue;

  const lines = [
    `@inproceedings{${key},`,
    `  title     = {{${data.title}}},`,
    `  author    = {${authors}},`,
    `  booktitle = {${venue}},`,
    `  year      = {${data.year}}`,
    `}`,
  ];
  return lines.join("\n");
}

export function getBibtex(data: PaperData): string {
  if (data.bibtex && data.bibtex.trim().length > 0) return data.bibtex.trim();
  return generateBibtex(data);
}
