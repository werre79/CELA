import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

// News
export const getNews = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("news").withIndex("by_date").order("desc").collect();
  },
});

// Publications
export const getPublications = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("publications").withIndex("by_createdAt").order("desc").collect();
  },
});

// Team
export const getTeam = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("team").withIndex("by_createdAt").order("desc").collect();
  },
});

export const addTeamMember = mutation({
  args: {
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    image: v.optional(v.string()),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    return await ctx.db.insert("team", args);
  },
});

export const deleteTeamMember = mutation({
  args: { id: v.id("team") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    return await ctx.db.delete(args.id);
  },
});

// Files
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    return await ctx.storage.generateUploadUrl();
  },
});
