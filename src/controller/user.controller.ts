import { Request, Response } from 'express';
import { createUser } from '../service/user.service';
import { CreateUserInput } from '../schema/user.schema';
import log from '../utils/logger';
import { omit } from 'lodash';

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput['body']>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user)
  } catch (err: any) {
    log.error(err);
    res.status(409).send(err.message);
  }
}
