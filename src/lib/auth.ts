import { SignJWT, jwtVerify } from 'jose';
import { UserSession } from './types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'tarbiyah_secure_jwt_secret_key_2026_quran_education'
);

export async function signToken(payload: UserSession): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserSession;
  } catch (err) {
    return null;
  }
}
