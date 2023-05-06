import { createTRPCProxyClient, TRPCClientErrorLike } from '@trpc/client';
import { createFlatProxy, createRecursiveProxy, inferTransformedProcedureOutput } from '@trpc/server/shared';
import type { AppRouter } from '~/server/api/trpc/[trpc]';

import { hash } from 'ohash';
import { httpLink as _httpLink, httpBatchLink as _httpBatchLink } from '@trpc/client';
import { type FetchEsque } from '@trpc/client/dist/internals/types';
import { FetchError } from 'ofetch';
import { AnyProcedure, AnyQueryProcedure, AnyRouter, inferProcedureInput } from '@trpc/server';
import { AsyncData, AsyncDataOptions } from 'nuxt/app';
import { KeyOfRes, PickFrom, _Transform } from 'nuxt/dist/app/composables/asyncData';

// Code adapted from trpc-nuxt: client/index.ts

export default defineNuxtPlugin(() => {
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
      })) as TypedClient<AppRouter>
    },
  }
});

// todo: expand to work with not only query procedures
type TypedProcedure<P extends AnyProcedure, R extends AnyRouter> =
  P extends AnyQueryProcedure
    ? { useQuery:
      <D = inferTransformedProcedureOutput<P>, T extends _Transform<D> = _Transform<D, D>>
      (input: inferProcedureInput<P>, opts?: AsyncDataOptions<D, T>)
      => AsyncData<PickFrom<ReturnType<T>, KeyOfRes<T>>, TRPCClientErrorLike<P>> }
    : never;

type TypedClient<R extends AnyRouter, P = R['_def']['record']> = {
  [K in keyof P]: P[K] extends AnyRouter
    ? TypedClient<R, P[K]['_def']['record']>
    : P[K] extends AnyProcedure
      ? TypedProcedure<P[K], R>
      : never;
};
