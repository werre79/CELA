import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  projects: defineTable({
    title: v.string(),
    slug: v.string(),
    desc: v.optional(v.string()),
    details: v.optional(v.string()),
    type: v.optional(v.string()),
    image: v.optional(v.string()),
    gallery: v.optional(v.array(v.string())),
    date: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_slug", ["slug"]).index("by_createdAt", ["createdAt"]),
  
  news: defineTable({
    title: v.optional(v.string()),
    desc: v.optional(v.string()),
    date: v.optional(v.string()),
    image: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_date", ["date"]),
  
  publications: defineTable({
    title: v.optional(v.string()),
    link: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_createdAt", ["createdAt"]),
  
  team: defineTable({
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    image: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_createdAt", ["createdAt"]),
});
