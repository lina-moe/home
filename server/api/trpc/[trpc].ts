import { procedure, router } from "~/server/trpc";
import { createNuxtApiHandler } from 'trpc-nuxt';

export type AppRouter = typeof appRouter;
export const appRouter = router({
  projects: procedure
    .query(() => ([
      {
        name: "lina.moe",
        desc: "https://lina.moe/"
      }
    ]))
});

export default createNuxtApiHandler({
  router: appRouter
});
