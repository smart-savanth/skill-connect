declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            DB_HOST: string;
            DB_PORT: number;
            DB_NAME: string;
            DB_USERNAME: string;
            DB_PASSWORD: string;
            DB_CON: string
        }
    }
}

export { }