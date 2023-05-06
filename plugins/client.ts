import { createTRPCProxyClient } from '@trpc/client';
import { createFlatProxy, createRecursiveProxy } from '@trpc/server/shared';
import type { AppRouter } from '~/server/api/trpc/[trpc]';

import { hash } from 'ohash';
import { httpLink as _httpLink, httpBatchLink as _httpBatchLink } from '@trpc/client';
import { type FetchEsque } from '@trpc/client/dist/internals/types';
import { FetchError } from 'ofetch';

// Code adapted from trpc-nuxt: client/index.ts

export default defineNuxtPlugin(() => {
  // const client = createTRPCNuxtClient<AppRouter>({
  //   links: [
  //     httpBatchLink({
  //       url: '/api/trpc',
  //     }),
  //   ],
  // })

  const headers = useRequestHeaders();
  const client = createTRPCProxyClient<AppRouter>({
    links: [
      _httpBatchLink<AppRouter>({
        url: '/api/trpc',
        headers() { return headers },
        fetch: ((input, init?: RequestInit & { method: 'GET' }) =>
          $fetch.raw(input.toString(), init)
          .catch(e => {
            if (e instanceof FetchError && e.response) { return e.response; }
            throw e;
          })
          .then(response => ({ ...response, json: () => Promise.resolve(response._data) }))) as FetchEsque
      })
    ]
  });

  return {
    provide: {
      client: createFlatProxy(name => createRecursiveProxy(opts => {
        const args = opts.args;
        const [input, other] = args;
        
        const segments = [name, ...opts.path];
        const last = segments.pop()!;
        const path = segments.join('.');

        if (last === 'useQuery') {
          const { trpc, ...asyncDataOptions } = other || {} as any;

          let controller: AbortController;
          if (trpc?.abortOnUnmount) {
            if (getCurrentInstance()) onScopeDispose(() => controller?.abort());
            controller = typeof AbortController !== 'undefined' ? new AbortController() : {} as AbortController;
          }

          const key = input === undefined ? path : `${path}-${hash(input || '')}`;
          return useAsyncData(key, () => (client as any)[path].query(input, {
            signal: controller?.signal,
            ...trpc
          }), asyncDataOptions);
        }

        return (client as any)[path][last](...args);
      }))
    },
  }
});
