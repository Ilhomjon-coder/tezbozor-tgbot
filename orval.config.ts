import { defineConfig } from 'orval';

// Generates a typed client + TanStack Query hooks from the backend's OpenAPI
// spec into shared/ (see tgbot/CLAUDE.md -> API client). The app is typed off
// the live contract; re-run `pnpm gen:api` after any backend API change.
//
// Default input is the LIVE spec (the deployed backend is the source of truth).
// Override with TEZBOZOR_API_SPEC to generate against a local backend, e.g.
//   TEZBOZOR_API_SPEC=http://localhost:3000/api/docs-json pnpm gen:api
const SPEC_URL =
  process.env.TEZBOZOR_API_SPEC ?? 'https://tezbozor-api.kesha.uz/api/docs-json';

export default defineConfig({
  tezbozor: {
    input: {
      target: SPEC_URL,
    },
    output: {
      mode: 'single',
      target: './shared/src/api/generated.ts',
      client: 'react-query',
      httpClient: 'fetch',
      override: {
        mutator: {
          path: './shared/src/api/fetcher.ts',
          name: 'customFetch',
        },
        query: {
          useQuery: true,
        },
      },
    },
  },
});
