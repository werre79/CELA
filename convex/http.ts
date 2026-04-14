import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();

// Mount @convex-dev/auth HTTP endpoints:
//   POST /api/auth/signin      → sign in
//   GET  /api/auth/signout     → sign out  
//   GET  /api/auth/session     → get current session
auth.addHttpRoutes(http);

export default http;
