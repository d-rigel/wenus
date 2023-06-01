import express, { Router } from 'express';
import articleRoute from './article.route';
import commentRoute from './comments.route';
import authRoute from './auth.route';
import userRoute from './user.route';

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

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
