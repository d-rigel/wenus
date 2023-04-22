import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
// @ts-ignore
import xss from 'xss-clean';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import httpStatus from 'http-status';
import cloudinary from 'cloudinary';
import config from './config/config';
import { morgan } from './modules/logger';
// import { jwtStrategy } from './modules/auth';
// import { authLimiter } from './modules/utils';
import { ApiError, errorConverter, errorHandler } from './modules/errors';
// import routes from './routes/v1';
// import { upload } from './modules/media/multer';
import routes from './routes/index';

const app: Express = express();

cloudinary.v2.config({
  cloud_name: 'dmz3lqu6k',
  api_key: '612155235447954',
  api_secret: '29AVs3yBhLRB4vfmFYmxxvnb1co',
});

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// enable cors
app.use(cors());
app.options('*', cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(ExpressMongoSanitize());

// gzip compression
app.use(compression());

// jwt authentication
app.use(passport.initialize());
// passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
// if (config.env === 'production') {
//   app.use('/v1/auth', authLimiter);
// }

// v1 api routes
app.use('/v1', routes);
// app.use('/v1/images', express.static('src/modules/images'));

// send back a 404 error for any unknown api request
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
