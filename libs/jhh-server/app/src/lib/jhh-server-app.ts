import express, { Express, Router } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

import { JhhServerMiddlewareAuth } from '@jhh/jhh-server/middleware/auth';

import { JhhServerRouterApi } from '@jhh/jhh-server/router/api';
import { JhhServerRouterUser } from '@jhh/jhh-server/router/user';

import { ApiRoute } from '@jhh/shared/domain';

export function JhhServerApp(): Express {
  const app: Express = express();

  app.set('trust proxy', 1);

  if (process.env.NODE_ENV !== 'development') {
    app.use(helmet());
  }

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });

  app.use(limiter);

  app.use(mongoSanitize());
  app.use(xss());

  const apiRouter: Router = JhhServerRouterApi();
  const userRouter: Router = JhhServerRouterUser();

  app.use(express.json());
  app.use(cors());
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(ApiRoute.BaseProtected, JhhServerMiddlewareAuth, apiRouter);
  app.use(ApiRoute.BaseUser, userRouter);

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  });

  return app;
}
