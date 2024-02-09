import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid(
    'development',
    'production',
    'test',
    'provision',
  ),
  MONGO_URI: Joi.required(),
  MONGO_DB_NAME: Joi.string().default('fixsell_db'),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB_NAME: Joi.string().required(),
  POSTGRES_DB_HOST: Joi.string().required(),
  POSTGRES_DB_PORT: Joi.number().default(5432),
  POSTGRES_DB_USERNAME: Joi.string().default('postgres'),
  JWT_SEED: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_REGION: Joi.string().default('us-east-1'),
  AWS_BUCKET_NAME: Joi.string().default('fixsell-website-images'),
  HOST_API: Joi.string().default('http://localhost:3000'),
  PORT: Joi.number().default(3000),
});
