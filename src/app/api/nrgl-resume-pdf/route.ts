import { getNrglResumePdfFileNames } from '@/lib/nrglResumePdf';
import { handleResumePdfRequest } from '@/lib/resumePdfRoute';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  return handleResumePdfRequest(request, {
    forwardedSearchParams: ['trade'],
    getFileNames: getNrglResumePdfFileNames,
    getResumePath: locale => (locale === 'zh' ? '/zh/resume' : '/resume'),
  });
}
