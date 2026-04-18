import type { NextRequest } from 'next/server';
import { handleResumePdfRequest } from '@/lib/resumePdfRoute';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  return handleResumePdfRequest(request);
}
