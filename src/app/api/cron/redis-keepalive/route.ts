import { NextRequest, NextResponse } from 'next/server';
import { pingRedis } from '@/lib/tailoredResumeStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await pingRedis();

  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
