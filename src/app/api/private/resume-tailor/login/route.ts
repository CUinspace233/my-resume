import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  createNoIndexHeaders,
  isPrivatePasswordConfigured,
  isValidPrivatePassword,
  privateJson,
  requestHasPrivateResumeAccess,
  setPrivateAccessCookie,
} from '@/lib/privateAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return privateJson({
    passwordConfigured: isPrivatePasswordConfigured(),
    hasAccess: requestHasPrivateResumeAccess(request),
  });
}

export async function POST(request: NextRequest) {
  if (!isPrivatePasswordConfigured()) {
    return privateJson({ error: 'PRIVATE_RESUME_PASSWORD is not configured' }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;

  if (!body?.password || !isValidPrivatePassword(body.password)) {
    return privateJson({ error: 'Invalid password' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true }, { headers: createNoIndexHeaders() });
  setPrivateAccessCookie(response);
  return response;
}
