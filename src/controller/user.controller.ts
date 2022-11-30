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
    const { _id, name, email } = user;
    res.status(201).json({ _id, name, email });
  } catch (err: any) {
    log.error(err);
    res.status(409).send(err.message);
  }
}
