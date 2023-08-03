import Joi from 'joi';
require('dotenv').config();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    CLOUD_NAME: Joi.string().required().description('cloudinary cloud name'),
    API_KEY: Joi.number().required().description('Cloudinary api key'),
    API_SECRET: Joi.string().required().description('cloudinary api secret'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    // SMTP_HOST: Joi.string().description('server that will send the emails'),
    G_SMTP_HOST: Joi.string().description('server that will send the emails'),
    // SMTP_PORT: Joi.number().description('port to connect to the email server'),
    G_SMTP_PORT: Joi.number().description('port to connect to the email server'),
    // SMTP_USERNAME: Joi.string().description('username for email server'),
    G_SMTP_USER: Joi.string().description('username for email server'),
    // SMTP_PASSWORD: Joi.string().description('password for email server'),
    G_SMTP_PASSWORD: Joi.string().description('password for email server'),
    // EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    G_SMTP_EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    CLIENT_URL: Joi.string().required().description('Client url'),
    // AWS_ACCESS_KEY: Joi.string().required().description('AWS access key id'),
    // AWS_SECRET_KEY: Joi.string().required().description('AWS secret key'),
    MAILGUN_API_KEY: Joi.string().required().description('Mailgun API key'),
    MAILGUN_DOMAIN: Joi.string().required().description('Mailgun domain'),
    MAILGUN_USERNAME: Joi.string().required().description('Mailgun username'),
    // IDENTITYPASS_TEST_SECRET_KEY: Joi.string().required().description('Identity pass test secret key'),
    // IDENTITYPASS_TEST_PUBLIC_KEY: Joi.string().required().description('Identity pass test public key'),
    // IDENTITYPASS_SECRET_KEY: Joi.string().required().description('Identity pass secret key'),
    // IDENTITYPASS_PUBLIC_KEY: Joi.string().required().description('Identity pass public key'),
    // IDENTITYPASS_APP_ID: Joi.string().required().description('Identity pass app id'),
    // IDENTITYPASS_BASE_URL: Joi.string().required().description('Identity pass base url'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
// console.log('checkenv>>', envVars);

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  cloudinary: {
    cloud_name: envVars.CLOUD_NAME,
    api_key: envVars.API_KEY,
    api_secret: envVars.API_SECRET,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    cookieOptions: {
      httpOnly: true,
      secure: envVars.NODE_ENV === 'production',
      signed: true,
    },
  },
  email: {
    smtp: {
      host: envVars.G_SMTP_HOST,
      port: envVars.G_SMTP_PORT,
      auth: {
        user: envVars.G_SMTP_USER,
        pass: envVars.G_SMTP_PASSWORD,
      },
    },
    from: envVars.G_SMTP_EMAIL_FROM,
    mailgun: {
      apiKey: envVars.MAILGUN_API_KEY,
      domain: envVars.MAILGUN_DOMAIN,
      username: envVars.MAILGUN_USERNAME,
    },
  },
  // email: {
  //   smtp: {
  //     host: envVars.SMTP_HOST,
  //     port: envVars.SMTP_PORT,
  //     auth: {
  //       user: envVars.SMTP_USERNAME,
  //       pass: envVars.SMTP_PASSWORD,
  //     },
  //   },
  //   from: envVars.EMAIL_FROM,
  //   mailgun: {
  //     apiKey: envVars.MAILGUN_API_KEY,
  //     domain: envVars.MAILGUN_DOMAIN,
  //     username: envVars.MAILGUN_USERNAME,
  //   },
  // },
  //   aws: {
  //     accessKey: envVars.AWS_ACCESS_KEY,
  //     secretKey: envVars.AWS_SECRET_KEY,
  //     s3: {
  //       bucket: 'inec-croms',
  //     },
  //   },
  // identityPass: {
  //   publicKey: envVars.IDENTITYPASS_PUBLIC_KEY,
  //   secretKey: envVars.IDENTITYPASS_SECRET_KEY,
  //   testPublicKey: envVars.IDENTITYPASS_TEST_PUBLIC_KEY,
  //   testSecretKey: envVars.IDENTITYPASS_TEST_SECRET_KEY,
  //   appId: envVars.IDENTITYPASS_APP_ID,
  //   baseUrl: envVars.IDENTITYPASS_BASE_URL,
  // },
  clientUrl: envVars.CLIENT_URL,
};

export default config;
