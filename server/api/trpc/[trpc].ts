import { procedure, router } from "~/server/trpc";
// import { createNuxtApiHandler } from 'trpc-nuxt';

import { createURL } from 'ufo';
import { TRPCError } from "@trpc/server";
import { resolveHTTPResponse } from "@trpc/server/http";
import { createContext } from "vm";

// Code adapted from trpc-nuxt: index.ts

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

export default defineEventHandler(async (event) => {
  const { req, res } = event.node;
  const $url = createURL(req.url!);

  const path = (() => {
    const { params } = event.context;
    if (typeof params?.trpc === 'string') return params.trpc;

    if (params?.trpc && Array.isArray(params.trpc))
      return (params.trpc as string[]).join('/');
    
    return null;
  })();

  if (path === null) throw createError({
    statusCode: 500,
    statusMessage: JSON.stringify(appRouter.getErrorShape({
      error: new TRPCError({ message: 'Param "trpc" not found - is the file named `[trpc]`.ts or `[...trpc].ts`?', code: 'INTERNAL_SERVER_ERROR' }),
      type: 'unknown', ctx: undefined, path: undefined, input: undefined
    }))
  });

  const { status, headers, body } = await resolveHTTPResponse({
    router: appRouter,
    req: {
      method: req.method!, headers: req.headers,
      body: isMethod(event, 'GET') ? null : await readBody(event),
      query: $url.searchParams
    },
    path,
    createContext: async () => createContext?.(event)
  });

  res.statusCode = status;
  if (headers) Object.keys(headers).forEach(key => res.setHeader(key, headers[key]!));
  return body;
});

// export default createNuxtApiHandler({
//   router: appRouter
// });
