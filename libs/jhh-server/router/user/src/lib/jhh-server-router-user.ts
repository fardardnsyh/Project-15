import { Router } from 'express';

import { ApiRoute } from '@jhh/shared/domain';

import { JhhServerControllerUser } from '@jhh/jhh-server/controller/user';
import { JhhServerMiddlewareAuth } from '@jhh/jhh-server/middleware/auth';

export function JhhServerRouterUser(): Router {
  const router: Router = Router();
  const controller = JhhServerControllerUser();

  router.post(ApiRoute.Login, controller.login);
  router.post(ApiRoute.Register, controller.register);
  router.delete(
    ApiRoute.RemoveAccount,
    JhhServerMiddlewareAuth,
    controller.removeAccount
  );

  return router;
}
