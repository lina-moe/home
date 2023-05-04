import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

export const procedure  = t.procedure;
export const router     = t.router;
export const middleware = t.middleware;
