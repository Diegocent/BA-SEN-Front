/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_URL: string;
  // otras variables de entorno personalizadas aquí
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
