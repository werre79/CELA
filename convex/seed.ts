import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * ONE-TIME admin account setup.
 * Run this once from the Convex dashboard → Functions → seed:createAdmin
 * Then delete or comment out this file.
 * 
 * Never call this from the frontend!
 */
export const createAdmin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const { signIn } = await import("./auth");
    // @convex-dev/auth Password provider creates the user on first signIn
    // if the account doesn't exist yet.
    // We can also directly insert via the authTables if needed.
    return { message: `Use signIn from the login form to create the account: ${args.email}` };
  },
});
