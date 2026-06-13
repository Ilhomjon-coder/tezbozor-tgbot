// Minimal ambient typing for the Vite env var the fetcher reads. Declared
// locally so `shared` stays dependency-free (it must not depend on Vite). The
// mini app, which consumes this code, provides the real value at build time.
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
