import SessionModel from '../model/session.model';

export async function createUserSession(userId: string, userAgent: string) {
  const session = await SessionModel.create({ user: userId, userAgent });

  return session.toJSON();
}
