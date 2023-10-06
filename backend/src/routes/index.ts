import express, { Router } from 'express';
import articleRoute from './article.route';
import commentRoute from './comments.route';
import authRoute from './auth.route';
import userRoute from './user.route';
import docsRoute from "./swagger.route"
import config from "../config/config"
const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/article',
    route: articleRoute,
  },
  {
    path: '/comment',
    route: commentRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
];

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
