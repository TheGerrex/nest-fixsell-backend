import * as Joi from "joi";

export const JoiValidationSchema = Joi.object({
    NODE_ENV: Joi.string().valid(
        'development',
        'production',
        'test',
        'provision',
    ),
    MONGO_URI: Joi.required(),
    MONGO_DB_NAME: Joi.string().default("fixsell_db"),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_DB_NAME: Joi.string().required(),
    POSTGRES_DB_HOST:Joi.string().required(),
    POSTGRES_DB_PORT: Joi.number().default(5432),
    POSTGRES_DB_USERNAME: Joi.string().default("postgres")
})