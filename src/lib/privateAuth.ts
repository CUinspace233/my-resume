import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const privateResumeCookieName = 'private_resume_access';
export const privateResumeCookieMaxAge = 60 * 60 * 4;
export const noIndexHeaderValue = 'noindex, nofollow, noarchive';

function getPrivatePassword() {
  return process.env.PRIVATE_RESUME_PASSWORD;
}

export function isPrivatePasswordConfigured() {
  return Boolean(getPrivatePassword());
}

export function isValidPrivatePassword(password: string) {
  const expectedPassword = getPrivatePassword();
  return Boolean(expectedPassword) && password === expectedPassword;
}

export async function hasPrivateResumeAccess() {
  const cookieStore = await cookies();
  return cookieStore.get(privateResumeCookieName)?.value === '1';
}

export function requestHasPrivateResumeAccess(request: NextRequest) {
  return request.cookies.get(privateResumeCookieName)?.value === '1';
}

export function createNoIndexHeaders(headers?: HeadersInit) {
  const nextHeaders = new Headers(headers);
  nextHeaders.set('X-Robots-Tag', noIndexHeaderValue);
  nextHeaders.set('Cache-Control', 'no-store');
  return nextHeaders;
}

export function privateJson(
  body: unknown,
  init?: ResponseInit & {
    status?: number;
  }
) {
  return NextResponse.json(body, {
    ...init,
    headers: createNoIndexHeaders(init?.headers),
  });
}

export function unauthorizedPrivateJson() {
  return privateJson({ error: 'Unauthorized' }, { status: 401 });
}

export function setPrivateAccessCookie(response: NextResponse) {
  response.cookies.set(privateResumeCookieName, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: privateResumeCookieMaxAge,
  });
}
