import { Express, Request, Response } from 'express';

// controllers
import {
  createUserSessionHandler,
  getUserSessionHandler,
  googleOAuthHandler,
  updateUserSessionHandler,
} from './controller/session.controller';
import {
  createUserHandler,
  getCurrentUser,
} from './controller/user.controller';
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  updateProductHandler,
} from './controller/product.controller';

// schema
import { createSessionSchema } from './schema/session.schema';
import { createUserSchema } from './schema/user.schema';
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  deleteProductSchema,
} from './schema/product.schema';

// middleware
import requireUser from './middleware/requireUser';
import validateResource from './middleware/validateResource';

function routes(app: Express) {
  app.get('/healthcheck', (_: Request, res: Response) => res.sendStatus(200));

  // auth route
  app.post('/api/users', validateResource(createUserSchema), createUserHandler);
  app.get('/api/me', requireUser, getCurrentUser);

  // sessions route
  app.post(
    '/api/sessions',
    validateResource(createSessionSchema),
    createUserSessionHandler
  );
  app.get('/api/sessions', requireUser, getUserSessionHandler);
  app.get('/api/sessions/oauth/google', googleOAuthHandler);
  app.delete('/api/sessions', requireUser, updateUserSessionHandler);

  // products route
  app.post(
    '/api/products',
    [requireUser, validateResource(createProductSchema)],
    createProductHandler
  );
  app.get(
    '/api/products/:productId',
    validateResource(getProductSchema),
    getProductHandler
  );
  app.patch(
    '/api/products/:productId',
    [requireUser, validateResource(updateProductSchema)],
    updateProductHandler
  );
  app.delete(
    '/api/products/:productId',
    [requireUser, validateResource(deleteProductSchema)],
    deleteProductHandler
  );
}

export default routes;
