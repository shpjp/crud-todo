import { cookies } from 'next/headers';
import { verifyToken, JWTPayload } from './jwt';

/**
 * Get the authenticated user from the request
 * Must be called from API routes only (Node.js runtime)
 * @returns User payload or null if not authenticated
 */
export async function getAuthUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');

  if (!token) {
    return null;
  }

  return verifyToken(token.value);
}

/**
 * Require authentication - throws error if not authenticated
 * @returns User payload
 */
export async function requireAuth(): Promise<JWTPayload> {
  const user = await getAuthUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}
