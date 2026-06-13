import { defineConfig } from 'orval';

// Generates a typed client + TanStack Query hooks from the backend's OpenAPI
// spec into shared/ (see tgbot/CLAUDE.md -> API client). Requires the backend
// running on :3000. Re-run after any backend API change.
export default defineConfig({
  tezbozor: {
    input: {
      target: 'http://localhost:3000/api/docs-json',
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
