interface ImportMetaEnv {
  readonly VITE_API_KEY: string
  readonly VITE_DISCORD_CLIENT_ID: string
  [key: string]: any
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
};
