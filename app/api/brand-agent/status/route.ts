/**
 * GET /api/brand-agent/status
 * Proxies to Railway agent: GET /api/agent/status
 * Returns: { running, startedAt, stats, lastResult, recentLogs }
 */
import { NextRequest, NextResponse } from 'next/server';

const AGENT_URL     = process.env.BRAND_AGENT_URL!;
const AGENT_API_KEY = process.env.BRAND_AGENT_API_KEY!;

export async function GET(_req: NextRequest) {
  try {
    const res = await fetch(`${AGENT_URL}/api/agent/status`, {
      headers: { 'Authorization': `Bearer ${AGENT_API_KEY}` },
      cache:   'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
