/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_SERVER_URL: string;
  readonly VITE_AGORA_APP_ID: string;
  readonly VITE_EDITOR_LICENSE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
