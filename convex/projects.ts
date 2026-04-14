import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").withIndex("by_createdAt").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const project = await ctx.db.query("projects").withIndex("by_slug", q => q.eq("slug", args.slug)).first();
    if (project) return project;
    // Fallback like firebase had, though less needed now
    return null;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    desc: v.optional(v.string()),
    details: v.optional(v.string()),
    type: v.optional(v.string()),
    image: v.optional(v.string()),
    gallery: v.optional(v.array(v.string())),
    date: v.optional(v.string()),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    return await ctx.db.insert("projects", args);
  },
});
