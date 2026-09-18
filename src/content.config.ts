import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    navLabel: z.string(),
    group: z.enum(["roofing", "storm-damage", "commercial"]),
    slug: z.string(),
    searchIntent: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    heroEyebrow: z.string(),
    heroHeadline: z.string(),
    heroLede: z.string(),
    heroImage: z.string(),
    highlights: z.array(z.string()).default([]),
    faqs: z.array(faqSchema).default([]),
    relatedLinks: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  }),
});

const locations = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/locations" }),
  schema: z.object({
    city: z.string(),
    state: z.enum(["IN", "MI"]),
    county: z.string(),
    slug: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    heroImage: z.string(),
    heroEyebrow: z.string(),
    heroHeadline: z.string(),
    heroLede: z.string(),
    localContext: z.string(),
    servicesOffered: z.array(z.string()).default([]),
    faqs: z.array(faqSchema).default([]),
  }),
});

const learningCenter = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/learning-center" }),
  schema: z.object({
    title: z.string(),
    metaDescription: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default("No Limit Roofing"),
    excerpt: z.string(),
    heroImage: z.string().default("/images/drone-aerial-finished-roof-charcoal-hero.webp"),
    draft: z.boolean().default(false),
  }),
});

export const collections = { services, locations, learningCenter };
