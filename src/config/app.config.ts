export const EnvConfiguration = () => ({

    environment: process.env.NODE_ENV || 'dev',
    mongo_uri: process.env.MONGO_URI,
    mongo_db_name: process.env.MONGO_DB_NAME,
    postgres_password: process.env.POSTGRES_PASSWORD,
    postgres_db_name: process.env.POSTGRES_DB_NAME,
    postgres_db_host: process.env.POSTGRES_DB_HOST,
    postgres_db_port: process.env.POSTGRES_DB_PORT,
    postgres_db_username: process.env.POSTGRES_DB_USERNAME
})