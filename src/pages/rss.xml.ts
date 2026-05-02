import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts", (p) => !p.data.draft);
  return rss({
    title: "Tony Yang · Writing",
    description:
      "Notes on research, taste, and the boring parts of building AI.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.dek,
      link: `/writing/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
