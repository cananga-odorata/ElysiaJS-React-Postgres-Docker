interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    readonly MODE?: string;
    // add other env variables here as needed
}

declare global {
    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}

export const configEnv = {
    API_URL: import.meta.env.VITE_API_URL || "http://localhost:3001",
    NODE_ENV: import.meta.env.MODE || "development",
}