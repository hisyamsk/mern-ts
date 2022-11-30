import supertest from 'supertest';
import mongoose from 'mongoose';
import * as UserService from '../service/user.service';
import * as SessionService from '../service/session.service';
import { createServer } from '../utils/createServer';

const userId: string = new mongoose.Types.ObjectId().toString();
const userPayload = {
  _id: userId,
  email: 'hisyam@email.com',
  name: 'Hisyam',
};
const sessionInput = {
  email: 'hisyam@email.com',
  password: '123password123',
};

const userInput = {
  ...sessionInput,
  name: 'Hisyam',
  passwordConfirmation: '123password123',
};

const app = createServer();

describe('user route', () => {
  describe('user registration', () => {
    it('should return 201 - user & password are valid', async () => {
      const createUserServiceMock = jest
        .spyOn(UserService, 'createUser')
        // @ts-ignore
        .mockReturnValueOnce(userPayload);

      const { statusCode, body } = await supertest(app)
        .post('/api/users')
        .send(userInput);

      expect(statusCode).toBe(201);
      expect(body).toEqual(userPayload);
      expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
    });

    it('should return 400 - user & password are not valid', async () => {
      const createUserServiceMock = jest
        .spyOn(UserService, 'createUser')
        // @ts-ignore
        .mockReturnValueOnce(userPayload);

      const { statusCode, body } = await supertest(app)
        .post('/api/users')
        .send({ ...userInput, passwordConfirmation: ' ' });

      expect(statusCode).toBe(400);
      expect(body[0].message).toBe('Password does not match');
      expect(createUserServiceMock).not.toHaveBeenCalled();
    });
    it('should return 409 - user service throws', async () => {
      const createUserServiceMock = jest
        .spyOn(UserService, 'createUser')
        // @ts-ignore
        .mockRejectedValue('error');

      const { statusCode } = await supertest(app)
        .post('/api/users')
        .send(userInput);

      expect(statusCode).toBe(409);
      expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
    });
  });

  describe('user session', () => {
    it('should return accessToken & refreshToken', async () => {
      const sessionId = new mongoose.Types.ObjectId();
      jest
        .spyOn(UserService, 'validatePassword')
        .mockResolvedValue(userPayload);

      jest
        .spyOn(SessionService, 'createUserSession')
        // @ts-ignore
        .mockResolvedValue({
          user: userPayload._id,
          _id: sessionId,
          valid: true,
          userAgent: '',
        });

      const { statusCode, body } = await supertest(app)
        .post('/api/sessions')
        .send(sessionInput);

      expect(statusCode).toBe(200);
      expect(body).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });
  });
});
